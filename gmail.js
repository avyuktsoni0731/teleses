const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:5000/oauth2callback'
);

const generateAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
};

const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

const getAllEmails = async (tokens) => {
  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const res = await gmail.users.messages.list({
    userId: 'me',
  });

  const messages = res.data.messages || [];
  const emails = [];

  for (const message of messages) {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
    });
    emails.push(msg.data.snippet);
  }

  return emails;
};


module.exports = { generateAuthUrl, getToken, getAllEmails };
