import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import savingsRoutes from "./routes/savings.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { globalErrorHandler } from "./utils/errorHandler.js";

dotenv.config();

// ============ ENVIRONMENT VARIABLE VALIDATION ============
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "PAYSTACK_SECRET_KEY"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  console.error(
    "Please ensure all required variables are set in your .env file",
  );
  process.exit(1);
}

console.log("All required environment variables are configured");

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // Add size limit for security

app.use("/api/auth", authRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/payments", paymentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global error handler (must be last)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
  );
});
