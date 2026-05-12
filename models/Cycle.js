import mongoose from "mongoose";

const cycleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    cycleType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "fixed"],
      required: true,
    },

    contributionAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    adminCharge: {
      type: Number,
      required: true,
      default: 0,
    },

    contributionUnit: {
      type: Number,
      required: true,
    },

    durationCount: {
      type: Number,
      required: true,
    },

    completedContributionUnits: {
      type: Number,
      default: 0,
    },

    totalSaved: {
      type: Number,
      default: 0,
    },

    totalAdminRevenue: {
      type: Number,
      default: 0,
    },

    totalAgentRevenue: {
      type: Number,
      default: 0,
    },

    lockedBalance: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

totalContributed: {
  type: Number,
  default: 0,
},

contributedUnits: {
  type: Number,
  default: 0,
},

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    completedAt: Date,

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isBonusPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cycle", cycleSchema);

