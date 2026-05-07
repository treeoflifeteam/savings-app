import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "charge"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    effect: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: ["app", "manual", "wallet", "cycle", "paystack"],
      default: "app",
    },
    paymentReference: String,
    paymentMethod: String,
    description: String,
  },
  { timestamps: { createdAt: "date" } },
);

export default mongoose.model("Transaction", transactionSchema);
