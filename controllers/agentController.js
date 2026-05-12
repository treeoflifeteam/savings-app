import User from "../models/User.js";

import Wallet from "../models/Wallet.js";

import Cycle from "../models/Cycle.js";

import Ledger from "../models/Ledger.js";

import AgentCommission from "../models/AgentCommission.js";

import { generateReference } from "../utils/generateToken.js";

// ======================================
// GET AGENT USERS
// ======================================

export const getAgentUsers = async (req, res) => {
  try {
    const users = await User.find({
      referredBy: req.user._id,
    }).select("-password");

    res.status(200).json({
      success: true,

      users,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to fetch users",
    });
  }
};

// ======================================
// CREATE USER FOR AGENT
// ======================================

export const createUserByAgent = async (req, res) => {
  try {
    const { fullName, phone, password } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    const existingUser = await User.findOne({
      phone,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,

        message: "Phone already exists",
      });
    }

    // ==============================
    // CREATE USER
    // ==============================

    const user = await User.create({
      fullName,

      phone,

      password,

      role: "user",

      referredBy: req.user._id,
    });

    // ==============================
    // MAP USER TO AGENT
    // ==============================

    req.user.agentUsers.push(user._id);

    await req.user.save();

    res.status(201).json({
      success: true,

      message: "User created successfully",

      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to create user",
    });
  }
};

// ======================================
// AGENT CREATE CYCLE
// ======================================

export const createCycleForUser = async (req, res) => {
  try {
    const { userId, cycleType, amountPerContribution, durationCount } =
      req.body;

    // ==============================
    // VERIFY USER BELONGS TO AGENT
    // ==============================

    const user = await User.findOne({
      _id: userId,

      referredBy: req.user._id,
    });

    if (!user) {
      return res.status(403).json({
        success: false,

        message: "Unauthorized user",
      });
    }

    // ==============================
    // CALCULATE TARGET
    // ==============================

    const totalTargetAmount = amountPerContribution * durationCount;

    const startDate = new Date();

    let endDate = new Date();

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

    const cycle = await Cycle.create({
      userId,

      cycleType,

      amountPerContribution,

      durationCount,

      totalTargetAmount,

      startDate,

      endDate,
    });

    res.status(201).json({
      success: true,

      cycle,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to create cycle",
    });
  }
};

// ======================================
// RELEASE AGENT COMMISSION
// ======================================

export const releaseAgentCommission = async (agentId, cycle, adminCharge) => {
  try {
    // ==============================
    // 50% SHARE
    // ==============================

    const contributionShare = adminCharge * 0.5;

    // ==============================
    // FIND WALLET
    // ==============================

    let wallet = await Wallet.findOne({
      userId: agentId,
    });

    if (!wallet) {
      wallet = await Wallet.create({
        userId: agentId,
      });
    }

    // ==============================
    // CREDIT WALLET
    // ==============================

    wallet.availableBalance += contributionShare;

    await wallet.save();

    // ==============================
    // LEDGER
    // ==============================

    await Ledger.create({
      userId: agentId,

      cycleId: cycle._id,

      reference: generateReference("AGENT_COMM"),

      type: "agent_commission",

      amount: contributionShare,

      description: "Contribution commission",
    });

    // ==============================
    // COMMISSION RECORD
    // ==============================

    await AgentCommission.create({
      agentId,

      userId: cycle.userId,

      cycleId: cycle._id,

      type: "contribution_share",

      amount: contributionShare,

      status: "released",

      releasedAt: new Date(),
    });
  } catch (error) {
    console.log(error);
  }
};
