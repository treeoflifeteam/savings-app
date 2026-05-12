import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

console.log("Testing environment variables...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "SET" : "NOT SET");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");
console.log(
  "PAYSTACK_SECRET_KEY:",
  process.env.PAYSTACK_SECRET_KEY ? "SET" : "NOT SET",
);

console.log("Testing database connection...");
try {
  await connectDB();
  console.log("Database connection test passed!");
} catch (error) {
  console.error("Database connection test failed:", error.message);
  process.exit(1);
}
