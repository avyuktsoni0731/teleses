const express = require("express");
const cors = require("cors");
const { generateAuthUrl, getToken, getAllEmails } = require("./gmail");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.get("/auth", (req, res) => {
  const url = generateAuthUrl();
  res.redirect(url);
});

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const tokens = await getToken(code);
  res.redirect(`http://localhost:3000?tokens=${JSON.stringify(tokens)}`);
});

app.get("/emails", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const tokenString = authHeader.replace("Bearer ", "");
    try {
      const tokens = JSON.parse(tokenString);
      const emails = await getAllEmails(tokens);
      res.json(emails);
    } catch (error) {
      res.status(400).json({ error: "Invalid token format" });
    }
  } else {
    res.status(401).json({ error: "Authorization header missing" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
