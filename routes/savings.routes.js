import express from "express";
import { protect, isAdminProtect } from "../middleware/auth.middleware.js";
import {
  getProfile,
  startCycle,
  addSavings,
  withdraw,
  getTransactions,
  getAllUsers,
  getUserById,
  createUserAdmin,
  getAllTransactions,
  adminStartCycle,
  adminAddSavings,
  adminWithdraw,
} from "../controllers/savings.controller.js";
import {
  validateCycleStart,
  validateAddSavings,
  validateWithdrawal,
  validateAdminUserCreate,
  validateAdminAction,
} from "../middleware/validation.middleware.js";

const router = express.Router();

// User routes (protected)
router.get("/profile", protect, getProfile);
router.post("/cycle/start", protect, validateCycleStart, startCycle);
router.post("/add", protect, validateAddSavings, addSavings);
router.post("/withdraw", protect, validateWithdrawal, withdraw);
router.get("/transactions", protect, getTransactions);

// Admin routes (protected with admin verification)
router.get("/users", protect, isAdminProtect, getAllUsers);
router.get(
  "/users/:userId",
  protect,
  isAdminProtect,
  validateAdminAction,
  getUserById,
);
router.post(
  "/admin/users/create",
  protect,
  isAdminProtect,
  validateAdminUserCreate,
  createUserAdmin,
);
router.get("/admin/transactions", protect, isAdminProtect, getAllTransactions);

// Admin actions on a specific user
router.post(
  "/admin/cycle/start/:userId",
  protect,
  isAdminProtect,
  validateAdminAction,
  validateCycleStart,
  adminStartCycle,
);
router.post(
  "/admin/savings/add/:userId",
  protect,
  isAdminProtect,
  validateAdminAction,
  validateAddSavings,
  adminAddSavings,
);
router.post(
  "/admin/withdraw/:userId",
  protect,
  isAdminProtect,
  validateAdminAction,
  validateWithdrawal,
  adminWithdraw,
);

export default router;
