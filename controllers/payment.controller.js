import Paystack from "paystack-api";
import crypto from "crypto";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { catchAsync, AppError } from "../utils/errorHandler.js";

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// ============ INITIALIZE PAYMENT ============
export const initializePayment = catchAsync(async (req, res) => {
  const { amount, days, cycleId } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.currentCycle || user.currentCycle.status !== "active") {
    throw new AppError("No active savings cycle", 400);
  }

  const cycle = user.currentCycle;
  const remainingDays = cycle.totalDays - cycle.daysPaid;

  if (days > remainingDays) {
    throw new AppError(`Only ${remainingDays} days remaining`, 400);
  }

  const totalAmount = cycle.dailyAmount * days * 100; // Paystack expects kobo

  const paymentData = {
    amount: totalAmount,
    email: user.phone + "@savingsapp.com", // Paystack requires email, using phone as fallback
    reference: `savings_${user._id}_${Date.now()}`,
    metadata: {
      userId: user._id.toString(),
      days,
      cycleId,
      custom_fields: [
        {
          display_name: "Days",
          variable_name: "days",
          value: days,
        },
      ],
    },
    callback_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`,
  };

  const response = await paystack.transaction.initialize(paymentData);

  res.json({
    msg: "Payment initialized",
    paymentUrl: response.data.authorization_url,
    reference: response.data.reference,
    amount: totalAmount / 100,
    days,
  });
});

// ============ VERIFY PAYMENT ============
export const verifyPayment = catchAsync(async (req, res) => {
  const { reference } = req.params;

  const response = await paystack.transaction.verify(reference);

  if (response.data.status === "success") {
    const { metadata, amount } = response.data;
    const reference = response.data.reference;

    const existingPayment = await Transaction.findOne({
      paymentReference: reference,
      type: "deposit",
    });
    if (existingPayment) {
      return res.json({
        msg: "Payment already processed",
        user: await User.findById(metadata.userId),
      });
    }

    const userId = metadata.userId;
    const days = metadata.days;

    // Process the savings addition
    const user = await User.findById(userId);
    if (!user || !user.currentCycle) {
      throw new AppError("Invalid payment data", 400);
    }

    const cycle = user.currentCycle;
    const paymentAmount = amount / 100; // Convert from kobo
    const expectedAmount = cycle.dailyAmount * days;

    if (paymentAmount !== expectedAmount) {
      throw new AppError("Payment amount mismatch", 400);
    }

    // Add savings logic here (similar to addSavings controller)
    const remainingDays = cycle.totalDays - cycle.daysPaid;
    if (days > remainingDays) {
      throw new AppError(`Only ${remainingDays} days remaining`, 400);
    }

    let charges = 0;
    if (!cycle.chargesTaken) {
      charges = cycle.dailyAmount * 0.5; // 50% charge for app payments
    }

    // Create deposit transaction
    await Transaction.create({
      userId: user._id,
      type: "deposit",
      amount: paymentAmount,
      effect: paymentAmount,
      source: "paystack",
      paymentReference: reference,
      paymentMethod: response.data.channel,
      description: `Payment for ${days} days savings`,
    });

    // Create charge transaction if applicable
    if (charges > 0) {
      await Transaction.create({
        userId: user._id,
        type: "charge",
        amount: charges,
        effect: -charges,
        source: "paystack",
        paymentReference: reference,
        description: "Processing charge for app payment",
      });
    }

    cycle.daysPaid += days;
    cycle.totalCharges += charges;
    cycle.chargesTaken = cycle.chargesTaken || charges > 0;

    const updatedDays = cycle.daysPaid;
    if (updatedDays >= cycle.totalDays) {
      cycle.status = "completed";

      const totalSaved =
        cycle.dailyAmount * cycle.totalDays - cycle.totalCharges;

      user.cycles.push({
        ...cycle,
        totalSaved,
        finalBalance: totalSaved,
        completedAt: new Date(),
      });

      user.walletBalance += totalSaved;
      user.currentCycle = null;
    }

    await user.save();

    res.json({
      msg: "Payment verified and savings added successfully",
      user,
      payment: {
        reference,
        amount: paymentAmount,
        days,
        method: response.data.channel,
      },
    });
  } else {
    throw new AppError("Payment verification failed", 400);
  }
});

// ============ PAYMENT WEBHOOK ============
export const paymentWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const signature = req.headers["x-paystack-signature"];

    // Get the raw body for signature verification
    const body = req.body;
    const hash = crypto.createHmac("sha512", secret);
    hash.update(JSON.stringify(body));
    const calculatedSignature = hash.digest("hex");

    // Verify webhook signature
    if (signature !== calculatedSignature) {
      console.warn("Webhook signature verification failed");
      return res.sendStatus(401);
    }

    const event = body;

    // Only process successful charge events
    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const { reference } = event.data;

    // Verify the payment with Paystack API as additional security measure
    const response = await paystack.transaction.verify(reference);

    if (response.data.status !== "success") {
      console.warn(`Payment not successful for webhook: ${reference}`);
      return res.sendStatus(400);
    }

    const existingPayment = await Transaction.findOne({
      paymentReference: reference,
      type: "deposit",
    });
    if (existingPayment) {
      console.log(`Webhook already processed for payment: ${reference}`);
      return res.sendStatus(200);
    }

    const { metadata, amount } = response.data;
    const userId = metadata.userId;
    const days = metadata.days;

    // Process savings addition
    const user = await User.findById(userId);
    if (!user || !user.currentCycle) {
      console.warn(`Invalid payment data for webhook: ${reference}`);
      return res.sendStatus(400);
    }

    const cycle = user.currentCycle;
    const paymentAmount = amount / 100; // Convert from kobo
    const expectedAmount = cycle.dailyAmount * days;

    if (paymentAmount !== expectedAmount) {
      console.warn(`Payment amount mismatch for webhook: ${reference}`);
      return res.sendStatus(400);
    }

    // Add savings logic
    const remainingDays = cycle.totalDays - cycle.daysPaid;
    if (days > remainingDays) {
      console.warn(`Days exceed remaining for webhook: ${reference}`);
      return res.sendStatus(400);
    }

    let charges = 0;
    if (!cycle.chargesTaken) {
      charges = cycle.dailyAmount * 0.5; // 50% charge for app payments
    }

    // Create deposit transaction
    await Transaction.create({
      userId: user._id,
      type: "deposit",
      amount: paymentAmount,
      effect: paymentAmount,
      source: "paystack",
      paymentReference: reference,
      paymentMethod: response.data.channel,
      description: `Payment for ${days} days savings (webhook)`,
    });

    // Create charge transaction if applicable
    if (charges > 0) {
      await Transaction.create({
        userId: user._id,
        type: "charge",
        amount: charges,
        effect: -charges,
        source: "paystack",
        paymentReference: reference,
        description: "Processing charge for app payment",
      });
    }

    cycle.daysPaid += days;
    cycle.totalCharges += charges;
    cycle.chargesTaken = cycle.chargesTaken || charges > 0;

    const updatedDays = cycle.daysPaid;
    if (updatedDays >= cycle.totalDays) {
      cycle.status = "completed";

      const totalSaved =
        cycle.dailyAmount * cycle.totalDays - cycle.totalCharges;

      user.cycles.push({
        ...cycle,
        totalSaved,
        finalBalance: totalSaved,
        completedAt: new Date(),
      });

      user.walletBalance += totalSaved;
      user.currentCycle = null;
    }

    await user.save();
    console.log(`Webhook processed successfully: ${reference}`);
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
};

// ============ GET PAYMENT HISTORY ============
export const getPaymentHistory = catchAsync(async (req, res) => {
  const transactions = await Transaction.find({
    userId: req.user.id,
    source: "paystack",
  }).sort({ date: -1 });

  res.json(transactions);
});
