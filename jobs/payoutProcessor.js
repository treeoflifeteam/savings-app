import cron from "node-cron";

import Wallet from "../models/Wallet.js";

import Withdrawal from "../models/Withdrawal.js";

import Ledger from "../models/Ledger.js";

import { initiateTransfer } from "../services/monnifyService.js";

import { generateReference } from "../utils/generateToken.js";

// ======================================
// PROCESS PAYOUTS
// ======================================

export const startPayoutProcessor = () => {
  cron.schedule(
    "*/1 * * * *",

    async () => {
      try {
        const withdrawals = await Withdrawal.find({
          status: "pending",
        });

        for (const item of withdrawals) {
          try {
            item.status = "processing";

            await item.save();

            // ======================
            // TRANSFER
            // ======================

            const transfer = await initiateTransfer({
              amount: item.finalAmount,

              reference: item.reference,

              narration: "Savings withdrawal",

              bankCode: item.bankCode,

              accountNumber: item.accountNumber,

              accountName: item.accountName,
            });

            // ======================
            // SUCCESS
            // ======================

            item.status = "successful";

            item.processedAt = new Date();

            await item.save();

            // ======================
            // LEDGER
            // ======================

            await Ledger.create({
              userId: item.userId,

              type: "withdrawal_success",

              amount: item.amount,

              description: "Withdrawal successful",
            });
          } catch (error) {
            console.log(error);

            // ======================
            // REFUND USER
            // ======================

            const wallet = await Wallet.findOne({
              userId: item.userId,
            });

            if (wallet) {
              wallet.availableBalance += item.amount + item.charge;

              await wallet.save();

              // ====================
              // REVERSAL LEDGER
              // ====================

              await Ledger.create({
                userId: item.userId,

                reference: generateReference("PAYOUT_REVERSAL"),

                type: "withdrawal_reversal",

                amount: item.amount + item.charge,

                balanceAfter: wallet.availableBalance,

                description: "Withdrawal reversed after failed payout",
              });
            }

            item.status = "failed";

            item.failureReason = error.message;

            await item.save();
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  );
};
