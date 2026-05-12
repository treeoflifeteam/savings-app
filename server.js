import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

console.log("🚀 Starting KoloPay server...");

dotenv.config();
console.log("✅ Environment variables loaded");
import authRoutes from "./routes/authRoutes.js";
import { startCycleAutomation } from "./jobs/cycleAutomation.js";
import { startPaymentDetection } from "./jobs/paymentDetectionJob.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import cycleRoutes from "./routes/cycleRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import { startAgentSettlementJob } from "./jobs/agentSettlementJobs.js";
import reconciliationRoutes from "./routes/reconciliationRoutes.js";
import { startPayoutProcessor } from "./jobs/payoutProcessor.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

dotenv.config();

// ============ ENVIRONMENT VARIABLE VALIDATION ============
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "PAYSTACK_SECRET_KEY"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  console.error(
    "Please ensure all required variables are set in your .env file",
  );
  process.exit(1);
}

console.log("✅ All required environment variables are configured");

// Connect to database
console.log("🔌 Connecting to database...");
await connectDB();
console.log("✅ Database connected successfully");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // Add size limit for security
// start payment detection job (Gmail / bank alerts)
startPaymentDetection();

// ======================================
// ROUTES
// ======================================

app.use("/api/auth", authRoutes);

app.use("/api/agent", agentRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/cycles", cycleRoutes);

app.use("/api/payments", paymentRoutes);
app.use("/api/reconciliation", reconciliationRoutes);
app.use("/api/withdrawals", withdrawalRoutes);

// app.use("/api/auth", authRoutes);
// app.use("/api/savings", savingsRoutes);

// Serve static files from the React app build directory
app.use(express.static("dist"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

// ======================================
// SECURITY
// ======================================

app.use(helmet());

app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,
});

app.use(limiter);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global error handler (must be last)
// app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
  );

  // ==============================
  // START AUTOMATION JOBS
  // ==============================

  console.log("🔄 Starting cycle automation job...");
  startCycleAutomation();
  console.log("✅ Cycle automation job started");

  // Temporarily commented out - payment detection incomplete
  // startPaymentDetection();
  console.log("⏸️ Payment detection job disabled (incomplete)");
  // startPayoutProcessor();
  console.log("⏸️ Payout processor disabled for stability");

  // ==============================
  // START AGENT JOBS
  // ==============================

  // startAgentSettlementJob();
  console.log("⏸️ Agent settlement job disabled for stability");

  console.log("🎉 All systems initialized successfully!");
});
