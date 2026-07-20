// ============================================================
//  routes/auth.js — everything under /api/auth (OTP login)
//  The actual OTP generation/checking lives in ../otp.js —
//  this file is just the HTTP wiring around it.
// ============================================================

const express = require("express");
const db = require("../db");
const otp = require("../otp");

const router = express.Router();

// Step 1: customer submits their phone or email, we text/email them a code.
router.post("/request-otp", (req, res) => {
  const identifier = (req.body.identifier || "").trim();
  if (!identifier) {
    return res.status(400).json({ error: "Please enter a phone number or email." });
  }
  const devCode = otp.requestOtp(identifier);
  res.json({
    ok: true,
    message: `A code was sent to ${identifier}.`,
    // Only present when CONFIG.otpDevMode is true (local testing only).
    devCode,
  });
});

// Step 2: customer submits the code they received.
router.post("/verify-otp", (req, res) => {
  const identifier = (req.body.identifier || "").trim();
  const code = (req.body.code || "").trim();
  if (!identifier || !code) {
    return res.status(400).json({ error: "Missing phone/email or code." });
  }

  const result = otp.verifyOtp(identifier, code);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  const user = db.findOrCreateUser(identifier);
  const token = otp.createSession(identifier);
  res.json({ ok: true, token, user });
});

// Given a session token (from login), who is this?
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  const session = otp.getSession(token);
  if (!session) {
    return res.status(401).json({ error: "Not logged in." });
  }
  const user = db.getUserByIdentifier(session.identifier);
  res.json({ ok: true, user });
});

module.exports = router;
