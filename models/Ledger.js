
import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    cycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cycle",
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: [
        "contribution",
        "wallet_credit",
        "wallet_debit",
        "cycle_release",
        "admin_revenue",
        "agent_commission",
        "withdrawal",
        "withdrawal_reversal",
        "bonus",
        "remainder_credit",
        "commission_release",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    balanceBefore: {
      type: Number,
      default: 0,
    },

    balanceAfter: {
      type: Number,
      default: 0,
    },

    description: String,

    metadata: {
      type: Object,
      default: {},
    },

    source: {
      type: String,
      enum: [
        "paystack",
        "monnify",
        "bank_transfer",
        "admin",
        "system",
      ],
      default: "system",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ledger", ledgerSchema);