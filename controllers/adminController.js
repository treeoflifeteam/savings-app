
import User from "../models/User.js";
import Cycle from "../models/Cycle.js";
import Withdrawal from "../models/Withdrawal.js";

import {
  catchAsync,
} from "../utils/errorHandler.js";

// ======================================
// GET ALL USERS
// ======================================

export const getAllUsers =
  catchAsync(async (req, res) => {
    const users =
      await User.find().select(
        "-password"
      );

    res.status(200).json({
      success: true,
      users,
    });
  });

// ======================================
// BLOCK USER
// ======================================

export const blockUser =
  catchAsync(async (req, res) => {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    user.isBlocked = true;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "User blocked successfully",
    });
  });

// ======================================
// UNBLOCK USER
// ======================================

export const unblockUser =
  catchAsync(async (req, res) => {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    user.isBlocked = false;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "User unblocked successfully",
    });
  });

// ======================================
// GET ALL WITHDRAWALS
// ======================================

export const getWithdrawals =
  catchAsync(async (req, res) => {
    const withdrawals =
      await Withdrawal.find()
        .populate(
          "userId",
          "fullName phone"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      withdrawals,
    });
  });

// ======================================
// GET ALL CYCLES
// ======================================

export const getAllCycles =
  catchAsync(async (req, res) => {
    const cycles =
      await Cycle.find()
        .populate(
          "userId",
          "fullName phone"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      cycles,
    });
  });
