import crypto from "crypto";

import Wallet from "../models/Wallet.js";

import Withdrawal from "../models/Withdrawal.js";

import Ledger from "../models/Ledger.js";

import { catchAsync } from "../utils/errorHandler.js";

import { generateReference } from "../utils/generateToken.js";

// ======================================
// REQUEST WITHDRAWAL
// ======================================

export const requestWithdrawal = catchAsync(async (req, res) => {
  const {
    amount,

    bankName,

    bankCode,

    accountNumber,

    accountName,
  } = req.body;

  // ==============================
  // FIND WALLET
  // ==============================

  const wallet = await Wallet.findOne({
    userId: req.user.id,
  });

  if (!wallet) {
    return res.status(404).json({
      success: false,
      message: "Wallet not found",
    });
  }

  // ==============================
  // CHARGE
  // ==============================

  const withdrawalCharge = 50;

  const totalDebit = amount + withdrawalCharge;

  // ==============================
  // BALANCE CHECK
  // ==============================

  if (wallet.availableBalance < totalDebit) {
    return res.status(400).json({
      success: false,
      message: "Insufficient balance",
    });
  }

  // ==============================
  // DEDUCT TEMPORARILY
  // ==============================

  wallet.availableBalance -= totalDebit;

  await wallet.save();

  // ==============================
  // CREATE WITHDRAWAL
  // ==============================

  const withdrawal = await Withdrawal.create({
    userId: req.user.id,

    amount,

    charge: withdrawalCharge,

    finalAmount: amount,

    bankName,

    bankCode,

    accountNumber,

    accountName,

    reference: crypto.randomUUID(),
  });

  // ==============================
  // LEDGER
  // ==============================

  await Ledger.create({
    userId: req.user.id,

    type: "withdrawal",

    reference: generateReference("WITHDRAW"),

    amount: totalDebit,

    balanceAfter: wallet.availableBalance,

    description: "Withdrawal request created",
  });

  res.status(200).json({
    success: true,
    message: "Withdrawal queued successfully",
    withdrawal,
  });
});
