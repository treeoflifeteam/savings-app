import Cycle from "../models/Cycle.js";

import Wallet from "../models/Wallet.js";

import Ledger from "../models/Ledger.js";

import User from "../models/User.js";

import { generateReference } from "../utils/generateToken.js";

// ======================================
// PROCESS CONTRIBUTION
// ======================================

export const processContribution = async ({
  cycleId,

  amount,

  narration = "",

  senderName = "",

  senderAccount = "",
}) => {
  // ==============================
  // FIND CYCLE
  // ==============================

  const cycle = await Cycle.findById(cycleId);

  if (!cycle) {
    throw new Error("Cycle not found");
  }

  // ==============================
  // ACTIVE ONLY
  // ==============================

  if (cycle.status !== "active") {
    throw new Error("Cycle inactive");
  }

  // ==============================
  // CALCULATE UNITS
  // ==============================

  const units = Math.floor(amount / cycle.contributionUnit);

  if (units <= 0) {
    throw new Error("Invalid contribution amount");
  }

  // ==============================
  // CALCULATE VALUES
  // ==============================

  const savingsAmount = units * cycle.contributionAmount;

  const adminAmount = units * cycle.adminCharge;

  const processedTotal = savingsAmount + adminAmount;

  const remainder = amount - processedTotal;

  // ==============================
  // UPDATE CYCLE
  // ==============================

  cycle.totalContributed += savingsAmount;

  cycle.lockedBalance += savingsAmount;

  cycle.totalAdminRevenue += adminAmount;

  cycle.contributedUnits += units;

  // ==============================
  // AUTO COMPLETE
  // ==============================

  const now = new Date();

  if (now >= cycle.endDate) {
    cycle.status = "completed";

    cycle.completedAt = now;
  }

  await cycle.save();

  // ==============================
  // HANDLE REMAINDER
  // ==============================

  if (remainder > 0) {
    let wallet = await Wallet.findOne({
      userId: cycle.userId,
    });

    if (!wallet) {
      wallet = await Wallet.create({
        userId: cycle.userId,
      });
    }

    wallet.availableBalance += remainder;

    await wallet.save();

    // ============================
    // WALLET LEDGER
    // ============================

    await Ledger.create({
      userId: cycle.userId,

      cycleId: cycle._id,

      reference: generateReference("WALLET"),

      type: "wallet_credit",

      amount: remainder,

      balanceAfter: wallet.availableBalance,

      description: "Contribution remainder moved to wallet",
    });
  }

  // ==============================
  // CONTRIBUTION LEDGER
  // ==============================

  await Ledger.create({
    userId: cycle.userId,

    cycleId: cycle._id,

    reference: generateReference("CONTRIB"),

    type: "deposit",

    amount: savingsAmount,

    description: `${units} contribution units processed`,
  });

  // ==============================
  // AGENT COMMISSION
  // ==============================

  if (cycle.agentId) {
    const agent = await User.findById(cycle.agentId);

    if (agent) {
      let agentWallet = await Wallet.findOne({
        userId: agent._id,
      });

      if (!agentWallet) {
        agentWallet = await Wallet.create({
          userId: agent._id,
        });
      }

      const commission = adminAmount * 0.5;

      agentWallet.pendingCommission += commission;

      await agentWallet.save();

      // ==========================
      // AGENT LEDGER
      // ==========================

      await Ledger.create({
        userId: agent._id,

        cycleId: cycle._id,

        reference: generateReference("AGENT_COMM"),

        type: "agent_pending_commission",

        amount: commission,

        balanceAfter: agentWallet.pendingCommission,

        description: "Pending agent commission added",
      });
    }
  }

  return {
    success: true,

    units,

    savingsAmount,

    adminAmount,

    remainder,
  };
};
