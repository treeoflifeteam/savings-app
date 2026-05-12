import mongoose from "mongoose";

import bcrypt from "bcryptjs";

const userSchema =
  new mongoose.Schema(
    {
      fullName: {
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
        select: false,
      },

      role: {
        type: String,

        enum: [
          "user",
          "admin",
          "agent",
        ],

        default: "user",
      },

      savingsCode: {
  type: String,
  unique: true,
},

firstCycleBonusPaid: {
  type: Boolean,
  default: false,
},

      referredBy: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      agentUsers: [
  {
    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User",
  },
],

      isBlocked: {
        type: Boolean,
        default: false,
      },

      lastLogin: Date,
    },
    {
      timestamps: true,
    }
  );

// ======================================
// HASH PASSWORD
// ======================================

userSchema.pre(
  "save",
  async function () {

    // Only hash if password changed
    if (
      !this.isModified(
        "password"
      )
    ) {
      return;
    }

    const salt =
      await bcrypt.genSalt(10);

    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );
  }
);
// ======================================
// COMPARE PASSWORD
// ======================================

userSchema.methods.comparePassword =
  async function (
    enteredPassword
  ) {
    return bcrypt.compare(
      enteredPassword,
      this.password
    );
  };
  
export default mongoose.model(
  "User",
  userSchema
);