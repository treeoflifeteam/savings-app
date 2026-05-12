import mongoose from "mongoose";

const withdrawalSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      charge: {
        type: Number,
        default: 0,
      },

      finalAmount: {
        type: Number,
        required: true,
      },

      bankName: String,

      bankCode: String,

      accountNumber:
        String,

      accountName:
        String,

      reference: String,

      status: {
        type: String,

        enum: [
          "pending",
          "processing",
          "successful",
          "failed",
          "reversed",
        ],

        default:
          "pending",
      },

      failureReason:
        String,

      processedAt:
        Date,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Withdrawal",
  withdrawalSchema
);