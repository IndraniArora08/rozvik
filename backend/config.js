// ============================================================
//  ROZVIK CONFIG
//  Same settings as the CFG block in index.html.
//  Keep these two in sync (or later, let the frontend read
//  them from GET /api/config so you only change them here).
// ============================================================

const CONFIG = {
  // Your WhatsApp number (with country code, no "+").
  waNumber: "918368886161",

  // Money rules (all amounts are in Rupees).
  deliveryFee: 60,   // delivery charge added to small orders
  freeAbove: 500,    // order value at/above this = free delivery
  minOrder: 300,     // we reject orders below this amount

  cities: "Delhi & NCR",

  // Which port the server listens on.
  port: process.env.PORT || 3000,

  // OTP login (see auth.js). While this is true, the "send OTP"
  // API also hands the code back in its response, so you can test
  // login on your own machine without a real SMS/email provider.
  // ⚠️ Set this to false before the site goes live for real customers.
  otpDevMode: true,
};

module.exports = CONFIG;
