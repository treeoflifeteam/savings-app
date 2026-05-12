import Cycle from "../models/Cycle.js";

import { catchAsync } from "../utils/errorHandler.js";

import Wallet from "../models/Wallet.js";

import Ledger from "../models/Ledger.js";

import User from "../models/User.js";

import { ADMIN_CHARGES } from "../config/systemConfiguration.js";

import { processContribution } from "../services/contributionService.js";

// ======================================
// CREATE CYCLE
// ======================================

export const createCycle = catchAsync(async (req, res) => {
  const { userId, cycleType, contributionAmount, durationCount } = req.body;

  // ==============================
  // ADMIN CANNOT CREATE FOR SELF
  // ==============================

  if (req.user.role === "admin" && req.user.id === userId) {
    return res.status(403).json({
      success: false,
      message: "Admin cannot create cycle for self",
    });
  }

  // ==============================
  // AGENT CANNOT CREATE FOR SELF
  // ==============================

  if (req.user.role === "agent" && req.user.id === userId) {
    return res.status(403).json({
      success: false,
      message: "Agent cannot create cycle for self",
    });
  }

  // ==============================
  // ADMIN CHARGE
  // ==============================

  const adminCharge = ADMIN_CHARGES[cycleType] || 0;

  const contributionUnit = contributionAmount + adminCharge;

  // ==============================
  // DATE CALCULATION
  // ==============================

  const startDate = new Date();

  const endDate = new Date(startDate);

  if (cycleType === "daily") {
    endDate.setDate(endDate.getDate() + durationCount);
  }

  if (cycleType === "weekly") {
    endDate.setDate(endDate.getDate() + durationCount * 7);
  }

  if (cycleType === "monthly") {
    endDate.setMonth(endDate.getMonth() + durationCount);
  }

  if (cycleType === "fixed") {
    endDate.setMonth(endDate.getMonth() + durationCount);
  }

  // ==============================
  // CREATE CYCLE
  // ==============================

  const cycle = await Cycle.create({
    userId,

    createdBy: req.user.id,

    cycleType,

    contributionAmount,

    adminCharge,

    contributionUnit,

    durationCount,

    startDate,

    endDate,

    agentId: req.user.role === "agent" ? req.user.id : null,
  });

  res.status(201).json({
    success: true,
    cycle,
  });
});

// ======================================
// GET USER CYCLES
// ======================================

export const getUserCycles = catchAsync(async (req, res) => {
  const cycles = await Cycle.find({
    userId: req.user.id,
  }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    cycles,
  });
});

export const contributeToCycle = catchAsync(async (req, res) => {
  const { cycleId, amount, narration, senderName, senderAccount } = req.body;

  const result = await processContribution({
    cycleId,

    amount,

    narration,

    senderName,

    senderAccount,
  });

  res.status(200).json({
    success: true,

    message: "Contribution processed successfully",

    data: result,
  });
});
