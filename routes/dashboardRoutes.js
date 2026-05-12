import express from "express";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  authorizeRoles,
} from "../middleware/roleMiddleware.js";

import {
  getUserDashboard,
  getAdminDashboard,
  getAgentDashboard,
} from "../controllers/dashboardController.js";

const router =
  express.Router();

// ======================================
// USER DASHBOARD
// ======================================

router.get(
  "/user",
  protect,
  authorizeRoles("user"),
  getUserDashboard
);

// ======================================
// ADMIN DASHBOARD
// ======================================

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

// ======================================
// AGENT DASHBOARD
// ======================================

router.get(
  "/agent",
  protect,
  authorizeRoles("agent"),
  getAgentDashboard
);

export default router;