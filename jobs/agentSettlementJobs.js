import cron from "node-cron";

import Wallet from "../models/Wallet.js";

import Cycle from "../models/Cycle.js";

import User from "../models/User.js";

import Ledger from "../models/Ledger.js";

// ======================================
// MONTHLY AGENT SETTLEMENT
// ======================================

export const startAgentSettlementJob =
  () => {
    // ==================================
    // RUN:
    // 11:59PM LAST DAY OF MONTH
    // ==================================

    cron.schedule(
      "59 23 28-31 * *",

      async () => {
        try {
          console.log(
            "Running agent settlement..."
          );

          // ============================
          // FIND ALL AGENT CYCLES
          // ============================

          const completedCycles =
            await Cycle.find({
              status:
                "completed",

              agentId: {
                $ne: null,
              },
            });

          for (const cycle of completedCycles) {
            // ==========================
            // FIND AGENT
            // ==========================

            const agent =
              await User.findById(
                cycle.agentId
              );

            if (!agent) {
              continue;
            }

            let wallet =
              await Wallet.findOne({
                userId:
                  agent._id,
              });

            if (!wallet) {
              wallet =
                await Wallet.create({
                  userId:
                    agent._id,
                });
            }

            // ==========================
            // ₦100 BONUS
            // ==========================

            if (
              cycle.contributedUnits >=
              cycle.durationCount
            ) {
              wallet.pendingCommission +=
                100;

              await Ledger.create({
                userId:
                  agent._id,

                cycleId:
                  cycle._id,

                type:
                  "agent_bonus",

                amount: 100,

                balanceAfter:
                  wallet.pendingCommission,

                description:
                  "Completed cycle bonus",
              });
            }

            // ==========================
            // ₦300 FIRST CYCLE BONUS
            // ==========================

            const user =
              await User.findById(
                cycle.userId
              );

            if (
              user &&
              !user.firstCycleBonusPaid
            ) {
              wallet.pendingCommission +=
                300;

              user.firstCycleBonusPaid =
                true;

              await user.save();

              await Ledger.create({
                userId:
                  agent._id,

                cycleId:
                  cycle._id,

                type:
                  "agent_bonus",

                amount: 300,

                balanceAfter:
                  wallet.pendingCommission,

                description:
                  "First cycle completion bonus",
              });
            }

            await wallet.save();
          }

          // ============================
          // RELEASE COMMISSIONS
          // ============================

          const wallets =
            await Wallet.find({
              pendingCommission: {
                $gt: 0,
              },
            });

          for (const wallet of wallets) {
            const releasedAmount =
              wallet.pendingCommission;

            wallet.availableBalance +=
              releasedAmount;

            wallet.pendingCommission =
              0;

            await wallet.save();

            // ==========================
            // LEDGER
            // ==========================

            await Ledger.create({
              userId:
                wallet.userId,

              type:
                "commission_release",

              amount:
                releasedAmount,

              balanceAfter:
                wallet.availableBalance,

              description:
                "Monthly commission released",
            });
          }

          console.log(
            "Agent settlement completed"
          );
        } catch (error) {
          console.log(error);
        }
      }
    );
  };