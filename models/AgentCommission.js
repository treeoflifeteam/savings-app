
import mongoose from "mongoose";

const agentCommissionSchema =
  new mongoose.Schema(
    {
      agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      cycleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cycle",
      },

      type: {
        type: String,
        enum: [
          "signup_bonus",
          "contribution_share",
          "completion_bonus",
        ],
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "released",
        ],
        default: "pending",
      },

      releasedAt: Date,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "AgentCommission",
  agentCommissionSchema
);
