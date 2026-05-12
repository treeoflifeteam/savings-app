import axios from "axios";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { AppError } from "../utils/errorHandler.js";

// =========================================
// VERIFY PAYSTACK PAYMENT
// =========================================
export const verifyPaystackPayment = async (
  reference
) => {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.data.data;
};

// =========================================
// CHECK DUPLICATE PAYMENT
// =========================================
export const paymentAlreadyProcessed =
  async (reference) => {
    const existing = await Transaction.findOne({
      paymentReference: reference,
    });

    return !!existing;
  };

// =========================================
// PROCESS SUCCESSFUL PAYMENT
// =========================================
export const processSuccessfulPayment =
  async (paymentData) => {
    const {
      reference,
      amount,
      metadata,
      channel,
    } = paymentData;

    // Prevent duplicate processing
    const alreadyProcessed =
      await paymentAlreadyProcessed(reference);

    if (alreadyProcessed) {
      return {
        alreadyProcessed: true,
      };
    }

    const {
      userId,
      cycleId,
      units,
    } = metadata;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const cycle = user.cycles.id(cycleId);

    if (!cycle) {
      throw new AppError("Cycle not found", 404);
    }

    if (cycle.status !== "active") {
      throw new AppError(
        "Cycle already completed",
        400
      );
    }

    // =====================================
    // CONTRIBUTION LOGIC
    // =====================================

    const contributionUnit =
      cycle.contributionAmount +
      cycle.adminCharge;

    const paidAmount = amount / 100;

    const validUnits = Math.floor(
      paidAmount / contributionUnit
    );

    if (validUnits <= 0) {
      throw new AppError(
        "Insufficient contribution amount",
        400
      );
    }

    const totalSavings =
      validUnits *
      cycle.contributionAmount;

    const totalAdminRevenue =
      validUnits *
      cycle.adminCharge;

    const totalAgentRevenue =
      totalAdminRevenue * 0.5;

    const processedAmount =
      validUnits * contributionUnit;

    const remainder =
      paidAmount - processedAmount;

    // =====================================
    // UPDATE CYCLE
    // =====================================

    cycle.completedContributionUnits +=
      validUnits;

    cycle.totalSaved += totalSavings;

    // =====================================
    // REMAINDER TO WALLET
    // =====================================

    if (remainder > 0) {
      user.walletBalance += remainder;
    }

    // =====================================
    // CREATE LEDGER ENTRY
    // =====================================

    await Transaction.create({
      userId: user._id,

      cycleId: cycle._id,

      type: "contribution",

      amount: paidAmount,

      processedAmount,

      remainder,

      savingsCredit: totalSavings,

      adminRevenue:
        totalAdminRevenue,

      agentRevenue:
        totalAgentRevenue,

      validUnits,

      paymentReference: reference,

      paymentMethod: channel,

      source: "paystack",

      description: `${validUnits} contribution unit(s) processed`,
    });

    // =====================================
    // CHECK CYCLE COMPLETION
    // =====================================

    const now = new Date();

    if (now >= cycle.endDate) {
      cycle.status = "completed";

      // Move savings to wallet
      user.walletBalance +=
        cycle.totalSaved;

      // Agent bonus logic
      if (
        cycle.completedContributionUnits >=
        cycle.durationCount
      ) {
        // TODO:
        // Add ₦100 agent bonus
      }
    }

    await user.save();

    return {
      success: true,

      validUnits,

      totalSavings,

      remainder,

      walletBalance:
        user.walletBalance,
    };
  };

