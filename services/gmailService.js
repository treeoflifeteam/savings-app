import { google } from "googleapis";

const oauth2Client =
  new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,

    process.env.GMAIL_CLIENT_SECRET,

    process.env.GMAIL_REDIRECT_URI
  );

oauth2Client.setCredentials({
  refresh_token:
    process.env.GMAIL_REFRESH_TOKEN,
});

const gmail =
  google.gmail({
    version: "v1",

    auth: oauth2Client,
  });

// ======================================
// READ BANK ALERTS
// ======================================

export const getBankEmails =
  async () => {
    try {
      const response =
        await gmail.users.messages.list(
          {
            userId: "me",

            q: "from:alerts@opay-inc.com newer_than:1d",
          }
        );

      return (
        response.data.messages ||
        []
      );
    } catch (error) {
      console.log(error);

      return [];
    }
  };

// ======================================
// GET FULL EMAIL
// ======================================

export const getEmailContent =
  async (messageId) => {
    try {
      const message =
        await gmail.users.messages.get(
          {
            userId: "me",

            id: messageId,
          }
        );

      return message.data;
    } catch (error) {
      console.log(error);

      return null;
    }
  };