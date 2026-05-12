import PendingDeposit from "../models/PendingDeposit.js";

import Cycle from "../models/Cycle.js";

import User from "../models/User.js";

import {
  processContribution,
} from "../services/contributionService.js";

import {
  catchAsync,
} from "../utils/errorHandler.js";

// ======================================
// GET PENDING DEPOSITS
// ======================================

export const getPendingDeposits =
  catchAsync(async (req, res) => {
    const deposits =
      await PendingDeposit.find({
        status:
          "pending",
      })
        .populate(
          "possibleUsers",
          "fullName phone savingsCode"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      deposits,
    });
  });

// ======================================
// ASSIGN DEPOSIT
// ======================================

export const assignPendingDeposit =
  catchAsync(async (req, res) => {
    const {
      depositId,

      userId,
    } = req.body;

    // ==============================
    // FIND DEPOSIT
    // ==============================

    const deposit =
      await PendingDeposit.findById(
        depositId
      );

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message:
          "Pending deposit not found",
      });
    }

    // ==============================
    // ALREADY PROCESSED
    // ==============================

    if (
      deposit.status !==
      "pending"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Deposit already processed",
      });
    }

    // ==============================
    // FIND ACTIVE CYCLE
    // ==============================

    const cycle =
      await Cycle.findOne({
        userId,

        status:
          "active",
      });

    // ==============================
    // NO ACTIVE CYCLE
    // ==============================

    if (!cycle) {
      return res.status(400).json({
        success: false,
        message:
          "User has no active cycle",
      });
    }

    // ==============================
    // PROCESS CONTRIBUTION
    // ==============================

    await processContribution({
      cycleId:
        cycle._id,

      amount:
        deposit.amount,

      narration:
        deposit.narration,

      senderName:
        deposit.senderName,

      senderAccount:
        deposit.senderAccount,
    });

    // ==============================
    // UPDATE DEPOSIT
    // ==============================

    deposit.status =
      "processed";

    deposit.assignedUser =
      userId;

    deposit.reviewedBy =
      req.user.id;

    deposit.processedAt =
      new Date();

    await deposit.save();

    res.status(200).json({
      success: true,
      message:
        "Deposit assigned successfully",
    });
  });

// ======================================
// REJECT DEPOSIT
// ======================================

export const rejectPendingDeposit =
  catchAsync(async (req, res) => {
    const {
      depositId,

      reason,
    } = req.body;

    const deposit =
      await PendingDeposit.findById(
        depositId
      );

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message:
          "Deposit not found",
      });
    }

    deposit.status =
      "rejected";

    deposit.rejectionReason =
      reason;

    deposit.reviewedBy =
      req.user.id;

    await deposit.save();

    res.status(200).json({
      success: true,
      message:
        "Deposit rejected",
    });
  });