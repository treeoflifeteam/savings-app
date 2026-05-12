
import axios from "axios";

import Withdrawal from "../models/Withdrawal.js";

// ======================================
// CREATE PAYSTACK RECIPIENT
// ======================================

export const createRecipient =
  async ({
    accountNumber,
    bankCode,
    accountName,
  }) => {
    const response =
      await axios.post(
        "https://api.paystack.co/transferrecipient",
        {
          type: "nuban",

          name: accountName,

          account_number:
            accountNumber,

          bank_code: bankCode,

          currency: "NGN",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

            "Content-Type":
              "application/json",
          },
        }
      );

    return response.data.data;
  };

// ======================================
// INITIATE TRANSFER
// ======================================

export const initiateTransfer =
  async ({
    amount,
    recipientCode,
    reference,
  }) => {
    const response =
      await axios.post(
        "https://api.paystack.co/transfer",
        {
          source: "balance",

          amount: amount * 100,

          recipient:
            recipientCode,

          reason:
            "Savings withdrawal",

          reference,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

            "Content-Type":
              "application/json",
          },
        }
      );

    return response.data.data;
  };

// ======================================
// PROCESS WITHDRAWAL
// ======================================

export const processWithdrawal =
  async ({
    withdrawalId,
    bankCode,
  }) => {
    const withdrawal =
      await Withdrawal.findById(
        withdrawalId
      );

    if (!withdrawal) {
      throw new Error(
        "Withdrawal not found"
      );
    }

    const recipient =
      await createRecipient({
        accountNumber:
          withdrawal.accountNumber,

        accountName:
          withdrawal.accountName,

        bankCode,
      });

    const transfer =
      await initiateTransfer({
        amount:
          withdrawal.amount,

        recipientCode:
          recipient.recipient_code,

        reference:
          withdrawal.reference,
      });

    withdrawal.status =
      "processing";

    withdrawal.providerReference =
      transfer.reference;

    await withdrawal.save();

    return transfer;
  };
