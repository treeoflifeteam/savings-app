import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    currentCycle: {
      dailyAmount: Number,
      totalDays: Number,
      daysPaid: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
      },
      chargesTaken: {
        type: Boolean,
        default: false,
      },
      totalCharges: {
        type: Number,
        default: 0,
      },
      startDate: Date,
    },

    cycles: [
      {
        dailyAmount: Number,
        totalDays: Number,
        daysPaid: Number,
        totalSaved: Number,
        totalCharges: Number,
        finalBalance: Number,
        completedAt: Date,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
