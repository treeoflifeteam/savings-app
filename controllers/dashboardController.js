import User from "../models/User.js";
import Cycle from "../models/Cycle.js";
import Wallet from "../models/Wallet.js";
import Ledger from "../models/Ledger.js";
import Withdrawal from "../models/Withdrawal.js";
import AgentCommission from "../models/AgentCommission.js";

import { catchAsync } from "../utils/errorHandler.js";

// ======================================
// USER DASHBOARD
// ======================================

export const getUserDashboard = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const wallet = await Wallet.findOne({
    userId,
  });

  const activeCycles = await Cycle.find({
    userId,
    status: "active",
  }).sort({
    createdAt: -1,
  });

  const completedCycles = await Cycle.find({
    userId,
    status: "completed",
  });

  const recentTransactions = await Ledger.find({
    userId,
  })
    .sort({
      createdAt: -1,
    })
    .limit(10);

  const pendingDeposits = await Ledger.countDocuments({
    userId,
    status: "pending",
    type: {
      $in: ["wallet_credit", "contribution", "cycle_release"],
    },
  });

  const totalLocked = activeCycles.reduce(
    (acc, cycle) => acc + cycle.lockedBalance,
    0,
  );

  const totalSavings = (wallet?.availableBalance || 0) + totalLocked;

  res.status(200).json({
    success: true,

    stats: {
      walletBalance: wallet?.availableBalance || 0,

      lockedSavings: totalLocked,

      activeCycles: activeCycles.length,

      completedCycles: completedCycles.length,

      totalSavings,

      pendingDeposits,
    },

    wallet: {
      availableBalance: wallet?.availableBalance || 0,
      lockedBalance: wallet?.lockedBalance || 0,
      pendingCommission: wallet?.pendingCommission || 0,
    },

    activeCycles,

    recentTransactions,
  });
});

// ======================================
// ADMIN DASHBOARD
// ======================================

export const getAdminDashboard = catchAsync(async (req, res) => {
  const totalUsers = await User.countDocuments({
    role: "user",
  });

  const totalAgents = await User.countDocuments({
    role: "agent",
  });

  const activeCycles = await Cycle.countDocuments({
    status: "active",
  });

  const completedCycles = await Cycle.countDocuments({
    status: "completed",
  });

  const totalSavings = await Cycle.aggregate([
    {
      $group: {
        _id: null,

        total: {
          $sum: "$totalSaved",
        },
      },
    },
  ]);

  const totalAdminRevenue = await Cycle.aggregate([
    {
      $group: {
        _id: null,

        total: {
          $sum: "$totalAdminRevenue",
        },
      },
    },
  ]);

  const pendingWithdrawals = await Withdrawal.countDocuments({
    status: "pending",
  });

  const recentUsers = await User.find()
    .sort({
      createdAt: -1,
    })
    .limit(10)
    .select("-password");

  res.status(200).json({
    success: true,

    stats: {
      totalUsers,

      totalAgents,

      activeCycles,

      completedCycles,

      totalSavings: totalSavings[0]?.total || 0,

      totalAdminRevenue: totalAdminRevenue[0]?.total || 0,

      pendingWithdrawals,
    },

    recentUsers,
  });
});

// ======================================
// AGENT DASHBOARD
// ======================================

export const getAgentDashboard = catchAsync(async (req, res) => {
  const agentId = req.user.id;

  const users = await User.find({
    createdByAgent: agentId,
  });

  const userIds = users.map((user) => user._id);

  const activeCycles = await Cycle.countDocuments({
    userId: {
      $in: userIds,
    },

    status: "active",
  });

  const completedCycles = await Cycle.countDocuments({
    userId: {
      $in: userIds,
    },

    status: "completed",
  });

  const commissions = await AgentCommission.find({
    agentId,
  });

  const totalCommission = commissions.reduce(
    (acc, item) => acc + item.amount,
    0,
  );

  const releasedCommission = commissions
    .filter((c) => c.status === "released")
    .reduce((acc, item) => acc + item.amount, 0);

  res.status(200).json({
    success: true,

    stats: {
      totalUsers: users.length,

      activeCycles,

      completedCycles,

      totalCommission,

      releasedCommission,
    },

    users,
  });
});
