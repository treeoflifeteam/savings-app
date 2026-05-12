import express from "express";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  authorizeRoles,
} from "../middleware/roleMiddleware.js";

const router =
  express.Router();

// ======================================
// AGENT DASHBOARD
// ======================================

router.get(
  "/dashboard",

  protect,

  authorizeRoles("agent", "admin"),

  async (req, res) => {
    res.status(200).json({
      success: true,

      message:
        "Welcome Agent",

      user: req.user,
    });
  }
);

// ======================================
// AGENT WALLET
// ======================================

router.get(
  "/wallet",

  protect,

  authorizeRoles(
    "agent",
    "admin"
  ),

  async (req, res) => {
    res.status(200).json({
      success: true,

      wallet: {
        availableBalance: 0,

        lockedBalance: 0,

        totalCommission: 0,
      },
    });
  }
);

// ======================================
// AGENT REFERRALS
// ======================================

router.get(
  "/referrals",

  protect,

  authorizeRoles(
    "agent",
    "admin"
  ),

  async (req, res) => {
    res.status(200).json({
      success: true,

      referrals: [],
    });
  }
);

// ======================================
// AGENT COMMISSIONS
// ======================================

router.get(
  "/commissions",

  protect,

  authorizeRoles(
    "agent",
    "admin"
  ),

  async (req, res) => {
    res.status(200).json({
      success: true,

      commissions: [],
    });
  }
);

export default router;