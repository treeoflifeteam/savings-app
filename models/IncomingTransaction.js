import mongoose from "mongoose";

const incomingTransactionSchema =
  new mongoose.Schema(
    {
      amount: Number,

      narration: String,

      senderName: String,

      senderBank: String,

      transactionTime:
        Date,

      reference: String,

      processed: {
        type: Boolean,
        default: false,
      },

      matchedUser: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "IncomingTransaction",
  incomingTransactionSchema
);