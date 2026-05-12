import mongoose from "mongoose";

const pendingDepositSchema = new mongoose.Schema(
  {
    amount: Number,

    narration: String,

    senderName: String,

    senderAccount: String,

    timestamp: Date,

    emailReference: String,

    status: {
      type: String,

      enum: ["pending", "processed", "rejected"],

      default: "pending",
    },

    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },

    possibleUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    ],

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },

    pendingReason: String,

    rejectionReason: String,

    processedAt: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("PendingDeposit", pendingDepositSchema);
