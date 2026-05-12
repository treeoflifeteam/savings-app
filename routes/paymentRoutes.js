
import express from "express";

import {
  initializePayment,
  verifyPayment,
  paymentWebhook,
} from "../controllers/paymentController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/initialize",
  protect,
  initializePayment
);

router.get(
  "/verify/:reference",
  protect,
  verifyPayment
);

router.post(
  "/webhook",
  paymentWebhook
);

export default router;
