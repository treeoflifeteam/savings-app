
import AgentCommission from "../models/AgentCommission.js";

import {
  createLedgerEntry,
} from "./ledgerService.js";

// ======================================
// RELEASE AGENT COMMISSIONS
// ======================================

export const releaseAgentCommissions =
  async (cycleId) => {
    const commissions =
      await AgentCommission.find({
        cycleId,
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

        cycleId,

        type: "agent_commission",

        amount:
          commission.amount,

        description:
          "Agent commission released",

        source: "system",
      });
    }

    return commissions.length;
  };

// ======================================
// RELEASE SIGNUP BONUS
// ======================================

export const releaseSignupBonus =
  async ({
    agentId,
    userId,
    cycleId,
  }) => {
    const existing =
      await AgentCommission.findOne({
        userId,
        type: "signup_bonus",
      });

    if (existing) {
      return;
    }

    const commission =
      await AgentCommission.create({
        agentId,
        userId,
        cycleId,

        type: "signup_bonus",

        amount: 300,

        status: "released",

        releasedAt: new Date(),
      });

    await createLedgerEntry({
      userId: agentId,

      cycleId,

      type: "agent_commission",

      amount: 300,

      description:
        "Agent signup bonus",

      source: "system",
    });

    return commission;
  };
