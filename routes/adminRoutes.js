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
// ADMIN ONLY ROUTES
// ======================================

router.get(
  "/dashboard",

  protect,

  authorizeRoles("admin"),

  async (req, res) => {
    res.status(200).json({
      success: true,

      message:
        "Welcome Admin",
    });
  }
);

export default router;