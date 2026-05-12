
import Ledger from "../models/Ledger.js";

import {
  catchAsync,
} from "../utils/errorHandler.js";

// ======================================
// GET MY TRANSACTIONS
// ======================================

export const getMyTransactions =
  catchAsync(async (req, res) => {
    const transactions =
      await Ledger.find({
        userId: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      transactions,
    });
  });

// ======================================
// GET SINGLE TRANSACTION
// ======================================

export const getTransactionById =
  catchAsync(async (req, res) => {
    const transaction =
      await Ledger.findById(
        req.params.id
      );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message:
          "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  });
