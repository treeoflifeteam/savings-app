import PendingDeposit from "../models/PendingDeposit.js";

import User from "../models/User.js";

// ======================================
// CREATE PENDING DEPOSIT
// ======================================

export const createPendingDeposit =
  async ({
    amount,

    narration,

    senderName,

    senderAccount,

    emailReference,

    reason =
      "Unable to auto-process",
  }) => {
    // ==============================
    // FIND POSSIBLE USERS
    // ==============================

    const possibleUsers =
      await User.find({
        $or: [
          {
            fullName: {
              $regex:
                senderName,
              $options: "i",
            },
          },

          {
            phone: {
              $regex:
                senderAccount,
              $options: "i",
            },
          },
        ],
      }).limit(5);

    // ==============================
    // CREATE RECORD
    // ==============================

    return PendingDeposit.create({
      amount,

      narration,

      senderName,

      senderAccount,

      emailReference,

      possibleUsers:
        possibleUsers.map(
          (u) => u._id
        ),

      pendingReason:
  reason,

      status:
        "pending",
    });
  };