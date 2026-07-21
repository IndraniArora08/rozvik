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
//  Email OTPs are sent for real, via Resend (needs a
//  RESEND_API_KEY environment variable — set on Render, not
//  in this file). Mobile/SMS OTPs are NOT wired up yet — that
//  still needs an SMS provider (e.g. MSG91) plus DLT
//  registration in India, so for now they just log to the
//  terminal like before.
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

// Send the code by email, using Resend's API directly (no extra
// npm package needed — just a plain HTTP call).
async function sendOtpEmail(identifier, code) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No key configured (e.g. running on your own machine) —
    // just log it like before, so local testing still works.
    console.log(`[DEV] Would email OTP ${code} to ${identifier}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ROZVIK <login@otp.rozvik.com>",
      to: [identifier],
      subject: "Your ROZVIK login code",
      text: `Your ROZVIK login code is ${code}. It expires in 5 minutes.`,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Resend API error:", res.status, errText);
  }
}

// Actually deliver the code.
function sendOtp(identifier, code) {
  if (isEmail(identifier)) {
    // Fire-and-forget: the API response doesn't need to wait on
    // the email actually being delivered.
    sendOtpEmail(identifier, code).catch((err) =>
      console.error("Failed to send OTP email:", err)
    );
  } else {
    // TODO: SMS not wired up yet — needs an SMS provider (e.g.
    // MSG91) and DLT registration in India first.
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
