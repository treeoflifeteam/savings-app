import cron from "node-cron";

import Cycle from "../models/Cycle.js";

import Wallet from "../models/Wallet.js";

import User from "../models/User.js";

import Ledger from "../models/Ledger.js";

import AgentCommission from "../models/AgentCommission.js";
import { generateReference } from "../utils/generateToken.js";
// ======================================
// START AUTOMATION
// ======================================

export const startCycleAutomation = () => {
  // ==================================
  // RUN EVERY 1 HOUR
  // ==================================

  cron.schedule(
    "0 * * * *",

    async () => {
      console.log("Running cycle automation...");

      try {
        // ============================
        // FIND EXPIRED CYCLES
        // ============================

        const expiredCycles = await Cycle.find({
          status: "active",

          endDate: {
            $lte: new Date(),
          },
        });

        // ============================
        // PROCESS EACH CYCLE
        // ============================

        for (const cycle of expiredCycles) {
          console.log(`Processing cycle ${cycle._id}`);

          // ==========================
          // COMPLETE CYCLE
          // ==========================

          cycle.status = "completed";

          cycle.completedAt = new Date();

          await cycle.save();

          // ==========================
          // GET USER WALLET
          // ==========================

          let wallet = await Wallet.findOne({
            userId: cycle.userId,
          });

          if (!wallet) {
            wallet = await Wallet.create({
              userId: cycle.userId,
            });
          }

          // ==========================
          // MOVE MONEY TO WALLET
          // ==========================

          wallet.availableBalance += cycle.lockedBalance;

          await wallet.save();

          // ==========================
          // LEDGER ENTRY
          // ==========================

          await Ledger.create({
            userId: cycle.userId,

            cycleId: cycle._id,

            reference: generateReference("CYCLE_COMPLETE"),

            type: "cycle_credit",

            amount: cycle.lockedBalance,

            balanceAfter: wallet.availableBalance,

            description: "Cycle completed",
          });

          // ==========================
          // BONUS ENGINE
          // ==========================

          const user = await User.findById(cycle.userId);

          // ==========================
          // AGENT BONUS
          // ==========================

          if (
            user?.referredBy &&
            cycle.contributedUnits >= cycle.durationCount
          ) {
            let agentWallet = await Wallet.findOne({
              userId: user.referredBy,
            });

            if (!agentWallet) {
              agentWallet = await Wallet.create({
                userId: user.referredBy,
              });
            }

            // ========================
            // CREDIT BONUS
            // ========================

            agentWallet.availableBalance += 100;

            await agentWallet.save();

            // ========================
            // LEDGER
            // ========================

            await Ledger.create({
              userId: user.referredBy,

              cycleId: cycle._id,

              type: "agent_commission",

              amount: 100,

              balanceAfter: agentWallet.availableBalance,

              description: "Completed cycle bonus",
            });

            // ========================
            // COMMISSION RECORD
            // ========================

            await AgentCommission.create({
              agentId: user.referredBy,

              userId: cycle.userId,

              cycleId: cycle._id,

              type: "cycle_bonus",

              amount: 100,

              status: "released",

              releasedAt: new Date(),
            });

            console.log(`Bonus released to agent`);
          }

          console.log(`Cycle completed successfully`);
        }
      } catch (error) {
        console.log(error);
      }
    },
  );
};
