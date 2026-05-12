import axios from "axios";

// ======================================
// GET MONNIFY TOKEN
// ======================================

export const getMonnifyToken =
  async () => {
    const authString =
      Buffer.from(
        `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`
      ).toString("base64");

    const response =
      await axios.post(
        `${process.env.MONNIFY_BASE_URL}/api/v1/auth/login`,

        {},

        {
          headers: {
            Authorization: `Basic ${authString}`,
          },
        }
      );

    return response.data
      .responseBody
      .accessToken;
  };

// ======================================
// VERIFY ACCOUNT
// ======================================

export const verifyBankAccount =
  async ({
    accountNumber,
    bankCode,
  }) => {
    const token =
      await getMonnifyToken();

    const response =
      await axios.get(
        `${process.env.MONNIFY_BASE_URL}/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

// ======================================
// INITIATE TRANSFER
// ======================================

export const initiateTransfer =
  async ({
    amount,
    reference,
    narration,
    bankCode,
    accountNumber,
    accountName,
  }) => {
    const token =
      await getMonnifyToken();

    const response =
      await axios.post(
        `${process.env.MONNIFY_BASE_URL}/api/v2/disbursements/single`,

        {
          amount,

          reference,

          narration,

          destinationBankCode:
            bankCode,

          destinationAccountNumber:
            accountNumber,

          currency:
            "NGN",

          destinationAccountName:
            accountName,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };