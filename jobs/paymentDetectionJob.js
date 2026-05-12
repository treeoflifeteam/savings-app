import cron from "node-cron";

import User from "../models/User.js";

import Wallet from "../models/Wallet.js";

import Cycle from "../models/Cycle.js";

import Ledger from "../models/Ledger.js";
import { createPendingDeposit } from "../services/pendingDepositService.js";
import IncomingTransaction from "../models/IncomingTransaction.js";
import PendingDeposit from "../models/PendingDeposit.js";

import { ADMIN_CHARGES } from "../config/systemConfiguration.js";

import { getBankEmails, getEmailContent } from "../services/gmailService.js";

import { generateReference } from "../utils/generateToken.js";

// ======================================
// START PAYMENT DETECTION
// ======================================

export const startPaymentDetection = () => {
  // ==================================
  // EVERY 2 MINUTES
  // ==================================

  cron.schedule(
    "*/2 * * * *",

    async () => {
      try {
        console.log("Checking bank alerts...");

        const emails = await getBankEmails();

        for (const mail of emails) {
          // ==========================
          // PREVENT REPROCESS
          // ==========================

          const existing = await IncomingTransaction.findOne({
            reference: mail.id,
          });

          if (existing) {
            continue;
          }

          // ==========================
          // GET EMAIL
          // ==========================

          const email = await getEmailContent(mail.id);

          if (!email) {
            continue;
          }

          // ==========================
          // EXTRACT CONTENT
          // ==========================

          const snippet = email.snippet;

          // ==========================
          // REGEX EXTRACTION
          // ==========================

          const amountMatch = snippet.match(/NGN\s?([\d,]+\.\d{2})/);

          const narrationMatch = snippet.match(/Remark:\s(.+)/i);

          if (!amountMatch || !narrationMatch) {
            continue;
          }

          const amount = parseFloat(amountMatch[1].replace(/,/g, ""));

          const narration = narrationMatch[1].trim().toUpperCase();

          // ==========================
          // FIND USER
          // ==========================

          const user = await User.findOne({
            savingsCode: narration,
          });

          if (!user) {
            await createPendingDeposit({
              amount,

              narration,

              senderName,

              senderAccount,

              emailReference: mail.id,

              reason: "User not matched automatically",
            });

            continue;
          }

          // ==========================
          // STORE TRANSACTION
          // ==========================

          const transaction = await IncomingTransaction.create({
            amount,

            narration,

            reference: mail.id,

            matchedUser: user._id,

            processed: true,
          });

          // ==========================
          // FIND ACTIVE CYCLE
          // ==========================

          const cycle = await Cycle.findOne({
            userId: user._id,

            status: "active",
          });

          // ==========================
          // NO ACTIVE CYCLE
          // ==========================

          if (!cycle) {
            let wallet = await Wallet.findOne({
              userId: user._id,
            });

            if (!wallet) {
              wallet = await Wallet.create({
                userId: user._id,
              });
            }

            wallet.availableBalance += amount;

            await wallet.save();

            continue;
          }

          // ==========================
          // CHARGE ENGINE
          // ==========================

          const adminCharge = ADMIN_CHARGES[cycle.cycleType] || 0;

          // ==========================
          // UNIT COST / DETERMINE UNITS
          // ==========================

          const unitCost =
            cycle.contributionUnit || cycle.contributionAmount + adminCharge;

          const units = Math.floor(amount / unitCost);

          if (units <= 0) {
            continue;
          }

          // ==========================
          // CALCULATE
          // ==========================

          const savingsTotal = units * cycle.contributionAmount;

          const adminTotal = units * adminCharge;

          const processedTotal = savingsTotal + adminTotal;

          const remainder = amount - processedTotal;

          // ==========================
          // UPDATE CYCLE
          // ==========================

          cycle.totalContributed += savingsTotal;

          cycle.lockedBalance += savingsTotal;

          cycle.contributedUnits += units;

          cycle.totalAdminRevenue += adminTotal;

          await cycle.save();

          // ==========================
          // REMAINDER
          // ==========================

          if (remainder > 0) {
            let wallet = await Wallet.findOne({
              userId: user._id,
            });

            if (!wallet) {
              wallet = await Wallet.create({
                userId: user._id,
              });
            }

            wallet.availableBalance += remainder;

            await wallet.save();
          }

          // ==========================
          // LEDGER
          // ==========================

          await Ledger.create({
            userId: user._id,

            cycleId: cycle._id,

            reference: generateReference("PAYMENT"),

            type: "deposit",

            amount: savingsTotal,

            description: `${units} units contribution`,
          });

          console.log(`Processed payment for ${user.fullName}`);
        }
      } catch (error) {
        console.log(error);
      }
    },
  );
};
