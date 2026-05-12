import express from "express";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  adminOnly,
} from "../middleware/roleMiddleware.js";

import {
  getPendingDeposits,

  assignPendingDeposit,

  rejectPendingDeposit,
} from "../controllers/reconciliationController.js";

const router =
  express.Router();

// ======================================
// ADMIN ONLY
// ======================================

router.use(
  protect,
  adminOnly
);

// ======================================
// GET PENDING
// ======================================

router.get(
  "/pending",
  getPendingDeposits
);

// ======================================
// ASSIGN
// ======================================

router.post(
  "/assign",
  assignPendingDeposit
);

// ======================================
// REJECT
// ======================================

router.post(
  "/reject",
  rejectPendingDeposit
);

export default router;