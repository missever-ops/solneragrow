const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// test route
app.get("/health", (req, res) => res.json({ ok: true }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((err) => {
  if (err) console.error("❌ Mail transporter error:", err.message);
  else console.log("✅ Mail transporter ready");
});

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  console.log("REQ POST /subscribe", req.body);

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Solnera!",
      text: "Thank you for subscribing! More information about our product is coming soon.",
    });

    return res.json({ message: "Subscription successful! Email sent." });
  } catch (error) {
    console.error("❌ SendMail error:", error.message);
    return res.status(500).json({ message: `Error sending email: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://www.solneragrow.com/`);
  console.log(`Open: http://www.solneragrow.com/index.html`);
});