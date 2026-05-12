import crypto from "crypto";
import axios from "axios";

import Cycle from "../models/Cycle.js";

import { processContribution } from "../services/contributionService.js";

import { catchAsync } from "../utils/errorHandler.js";

// ======================================
// INITIALIZE PAYMENT
// ======================================

export const initializePayment = catchAsync(async (req, res) => {
  const { cycleId, amount } = req.body;

  const cycle = await Cycle.findById(cycleId);

  if (!cycle) {
    return res.status(404).json({
      success: false,
      message: "Cycle not found",
    });
  }

  if (cycle.status !== "active") {
    return res.status(400).json({
      success: false,
      message: "Cycle already completed",
    });
  }

  const reference = `PAY_${Date.now()}`;

  const payload = {
    email: `${req.user.phone}@savingsapp.com`,

    amount: amount * 100,

    reference,

    metadata: {
      cycleId: cycle._id.toString(),

      userId: req.user.id,
    },

    callback_url: `${process.env.FRONTEND_URL}/payment-success`,
  };

  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    payload,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

        "Content-Type": "application/json",
      },
    },
  );

  res.status(200).json({
    success: true,

    authorizationUrl: response.data.data.authorization_url,

    reference,
  });
});

// ======================================
// VERIFY PAYMENT
// ======================================

export const verifyPayment = catchAsync(async (req, res) => {
  const { reference } = req.params;

  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  const paymentData = response.data.data;

  if (paymentData.status !== "success") {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }

  const result = await processContribution({
    cycleId: paymentData.metadata.cycleId,
    amount: paymentData.amount / 100,
    narration: paymentData.narration || "",
    senderName: paymentData.customer
      ? paymentData.customer.first_name +
        " " +
        (paymentData.customer.last_name || "")
      : "",
  });

  res.status(200).json({
    success: true,
    result,
  });
});

// ======================================
// PAYSTACK WEBHOOK
// ======================================

export const paymentWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    const signature = req.headers["x-paystack-signature"];

    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== signature) {
      return res.sendStatus(401);
    }

    const event = req.body;

    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const paymentData = event.data;

    await processContribution({
      cycleId: paymentData.metadata.cycleId,
      amount: paymentData.amount / 100,
      narration: paymentData.narration || "",
      senderName: paymentData.customer
        ? paymentData.customer.first_name +
          " " +
          (paymentData.customer.last_name || "")
        : "",
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook Error:", error);

    return res.sendStatus(500);
  }
};
