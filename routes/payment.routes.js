import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  initializePayment,
  verifyPayment,
  paymentWebhook,
  getPaymentHistory,
} from "../controllers/payment.controller.js";
import { validatePaymentInit } from "../middleware/validation.middleware.js";

const router = express.Router();

// Protected routes
router.post("/initialize", protect, validatePaymentInit, initializePayment);
router.get("/verify/:reference", protect, verifyPayment);
router.get("/history", protect, getPaymentHistory);

// Webhook (no auth needed but uses raw body for signature verification)
router.post("/webhook", express.json(), paymentWebhook);

export default router;
