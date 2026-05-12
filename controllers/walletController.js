import Wallet from "../models/Wallet.js";

import Ledger from "../models/Ledger.js";

import Withdrawal from "../models/Withdrawal.js";

import { generateReference } from "../utils/generateToken.js";

// ======================================
// GET WALLET
// ======================================

export const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({
      userId: req.user._id,
    });

    // ==============================
    // AUTO CREATE WALLET
    // ==============================

    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user._id,
      });
    }

    res.status(200).json({
      success: true,

      wallet,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to fetch wallet",
    });
  }
};

// ======================================
// WALLET HISTORY
// ======================================

export const getWalletHistory = async (req, res) => {
  try {
    const history = await Ledger.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      history,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to fetch history",
    });
  }
};

// ======================================
// REQUEST WITHDRAWAL
// ======================================

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, accountName, accountNumber, bankName } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (!amount || !accountName || !accountNumber || !bankName) {
      return res.status(400).json({
        success: false,

        message: "All fields required",
      });
    }

    // ==============================
    // GET WALLET
    // ==============================

    const wallet = await Wallet.findOne({
      userId: req.user._id,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,

        message: "Wallet not found",
      });
    }

    // ==============================
    // CHECK BALANCE
    // ==============================

    if (wallet.availableBalance < amount) {
      return res.status(400).json({
        success: false,

        message: "Insufficient balance",
      });
    }

    // ==============================
    // DEDUCT IMMEDIATELY
    // ==============================

    wallet.availableBalance -= amount;

    await wallet.save();

    // ==============================
    // CREATE WITHDRAWAL RECORD
    // ==============================

    const withdrawal = await Withdrawal.create({
      userId: req.user._id,

      amount,

      accountName,

      accountNumber,

      bankName,

      status: "processing",
    });

    // ==============================
    // LEDGER ENTRY
    // ==============================

    await Ledger.create({
      userId: req.user._id,

      type: "withdrawal",

      reference: generateReference("WALLET_WITHDRAW"),

      amount,

      balanceAfter: wallet.availableBalance,

      description: "Wallet withdrawal",
    });

    // ==============================
    // FUTURE:
    // PAYSTACK/MONNIFY
    // ==============================

    // Here later:
    // initiateTransfer()

    res.status(200).json({
      success: true,

      message: "Withdrawal initiated",

      withdrawal,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Withdrawal failed",
    });
  }
};
