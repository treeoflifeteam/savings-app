import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      unique: true,
    },

    availableBalance: {
      type: Number,

      default: 0,
    },

    pendingCommission: {
      type: Number,
      default: 0,
    },

    totalWithdrawn: {
      type: Number,
      default: 0,
    },

    lockedBalance: {
      type: Number,

      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Wallet", walletSchema);
