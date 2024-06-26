const express = require('express');
const cors = require('cors');
const { generateAuthUrl, getToken, getLinkedInEmails } = require('./gmail');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.get('/auth', (req, res) => {
  const url = generateAuthUrl();
  res.redirect(url);
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const tokens = await getToken(code);
  res.redirect(`http://localhost:3000?tokens=${JSON.stringify(tokens)}`);
});

app.get('/emails', async (req, res) => {
  const tokens = JSON.parse(req.headers.authorization.replace('Bearer ', ''));
  const emails = await getAllEmails(tokens);
  res.json(emails);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
