// ============================================================
//  otp.js — OTP generation/verification (mobile or email).
//  Used by routes/auth.js, which is what the website actually calls.
//
//  How it works:
//   1. Customer types a phone number or email → we generate a
//      6-digit code and "send" it to them.
//   2. Customer types the code back → if it matches and hasn't
//      expired, we log them in and hand back a session token.
//
//  IMPORTANT — before this goes live on the real website:
//  Right now, sendOtp() below does NOT actually send a text
//  message or email. It just prints the code to this server's
//  terminal (and, only in dev mode, sends it back in the API
//  response so you can test without a phone/email provider).
//  To really send OTPs you need to sign up for:
//    - An SMS provider for phone OTPs, e.g. MSG91 or Twilio
//    - An email provider for email OTPs, e.g. Resend or SendGrid
//  Then fill in the two TODO spots inside sendOtp() with their
//  API call, using the API key from your provider account.
// ============================================================

const crypto = require("crypto");
const CONFIG = require("./config");

// identifier ("9876543210" or "a@b.com") -> { code, expiresAt }
const pendingOtps = new Map();

// token -> { identifier, createdAt }
// (Sessions live in memory only — they reset if the server restarts.
//  That's fine for a small store; swap in a real database/session
//  store later if you need people to stay logged in across restarts.)
const sessions = new Map();

const OTP_TTL_MS = 5 * 60 * 1000; // codes expire after 5 minutes

function isEmail(identifier) {
  return identifier.includes("@");
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

// Actually deliver the code. Replace the two TODOs with a real
// provider call once you've signed up for one.
function sendOtp(identifier, code) {
  if (isEmail(identifier)) {
    // TODO: send an email here, e.g. using Resend:
    //   await resend.emails.send({ to: identifier, subject: "Your ROZVIK code", text: `Your code is ${code}` });
    console.log(`[DEV] Would email OTP ${code} to ${identifier}`);
  } else {
    // TODO: send an SMS here, e.g. using MSG91/Twilio:
    //   await smsProvider.send({ to: identifier, message: `Your ROZVIK code is ${code}` });
    console.log(`[DEV] Would SMS OTP ${code} to ${identifier}`);
  }
}

function requestOtp(identifier) {
  const code = generateCode();
  pendingOtps.set(identifier, { code, expiresAt: Date.now() + OTP_TTL_MS });
  sendOtp(identifier, code);
  // Only hand the code back in the response while CONFIG.otpDevMode is on,
  // so you can test the flow locally before a real SMS/email provider is wired up.
  return CONFIG.otpDevMode ? code : undefined;
}

function verifyOtp(identifier, code) {
  const entry = pendingOtps.get(identifier);
  if (!entry) return { ok: false, error: "No code was requested for this number/email." };
  if (Date.now() > entry.expiresAt) {
    pendingOtps.delete(identifier);
    return { ok: false, error: "This code has expired. Please request a new one." };
  }
  if (entry.code !== String(code).trim()) {
    return { ok: false, error: "Incorrect code." };
  }
  pendingOtps.delete(identifier); // one-time use
  return { ok: true };
}

function createSession(identifier) {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, { identifier, createdAt: new Date().toISOString() });
  return token;
}

function getSession(token) {
  return sessions.get(token);
}

module.exports = { requestOtp, verifyOtp, createSession, getSession, isEmail };
