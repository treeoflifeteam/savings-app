
import Cycle from "../models/Cycle.js";
import AgentCommission from "../models/AgentCommission.js";

import {
  createLedgerEntry,
} from "./ledgerService.js";

// ======================================
// COMPLETE EXPIRED CYCLES
// ======================================

export const completeExpiredCycles =
  async () => {
    const now = new Date();

    const cycles =
      await Cycle.find({
        status: "active",
        endDate: {
          $lte: now,
        },
      });

    for (const cycle of cycles) {
      cycle.status = "completed";

      cycle.completedAt =
        new Date();

      await cycle.save();

      // ==========================
      // RELEASE LOCKED FUNDS
      // ==========================

      await createLedgerEntry({
        userId: cycle.userId,

        cycleId: cycle._id,

        type: "cycle_release",

        amount: cycle.lockedBalance,

        description:
          "Cycle completed and funds released",

        source: "system",
      });

      // ==========================
      // RELEASE AGENT COMMISSIONS
      // ==========================

      if (cycle.agentId) {
        const commissions =
          await AgentCommission.find({
            cycleId: cycle._id,
            status: "pending",
          });

        for (const commission of commissions) {
          commission.status =
            "released";

          commission.releasedAt =
            new Date();

          await commission.save();

          await createLedgerEntry({
            userId:
              commission.agentId,

            cycleId: cycle._id,

            type: "agent_commission",

            amount:
              commission.amount,

            description:
              "Agent commission released",

            source: "system",
          });
        }

        // ======================
        // COMPLETION BONUS
        // ======================

        if (
          cycle.completedContributionUnits >=
          cycle.durationCount
        ) {
          await createLedgerEntry({
            userId: cycle.agentId,

            cycleId: cycle._id,

            type: "bonus",

            amount: 100,

            description:
              "Cycle completion bonus",

            source: "system",
          });

          cycle.isBonusPaid = true;

          await cycle.save();
        }
      }
    }

    return {
      processed: cycles.length,
    };
  };
