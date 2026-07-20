// ============================================================
//  ROZVIK BACKEND  —  plain Node.js + Express
//
//  What it does:
//   1. Serves the product list to the website (routes/products.js).
//   2. Accepts orders from the checkout and saves them (routes/orders.js).
//   3. Handles OTP login (routes/auth.js).
//   4. Serves the website itself (the public/ folder).
//
//  Run it with:   npm install   then   npm start
//  Then open:     http://localhost:3000
// ============================================================

const path = require("path");
const express = require("express");
const cors = require("cors");

const CONFIG = require("./config");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");

const app = express();

// --- Middleware (small helpers that run on every request) ---
app.use(cors());            // allow the browser to call this API
app.use(express.json());    // understand JSON sent in request bodies

// ============================================================
//  API ROUTES  (everything under /api/...)
// ============================================================

// Simple "is the server alive?" check.
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Give the frontend the money/business rules it needs.
app.get("/api/config", (req, res) => {
  res.json({
    waNumber: CONFIG.waNumber,
    deliveryFee: CONFIG.deliveryFee,
    freeAbove: CONFIG.freeAbove,
    minOrder: CONFIG.minOrder,
    cities: CONFIG.cities,
  });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);

// ============================================================
//  SERVE THE WEBSITE
//  Everything the browser needs (index.html, css/, js/) lives
//  in public/, right inside this backend folder.
// ============================================================
app.use(express.static(path.join(__dirname, "public")));

// ============================================================
//  START THE SERVER
// ============================================================
app.listen(CONFIG.port, () => {
  console.log(`ROZVIK backend running at http://localhost:${CONFIG.port}`);
  console.log(`  Products:  http://localhost:${CONFIG.port}/api/products`);
  console.log(`  Health:    http://localhost:${CONFIG.port}/api/health`);
});
