// ============================================================
//  routes/orders.js — everything under /api/orders
// ============================================================

const express = require("express");
const CONFIG = require("../config");
const db = require("../db");

const router = express.Router();

// See all orders (handy for you as the shop owner).
router.get("/", (req, res) => {
  res.json(db.getOrders());
});

// ------------------------------------------------------------
//  Create a new order.
//
//  The website sends a list of items like:
//   {
//     "customer": { "name": "...", "phone": "...", "address": "..." },
//     "items": [ { "productId": 1, "weight": "250g", "qty": 2 } ]
//   }
//
//  We DON'T trust the prices from the browser — we look every
//  price up ourselves from products.json. That stops anyone
//  editing prices in their browser before checking out.
// ------------------------------------------------------------
router.post("/", (req, res) => {
  const body = req.body || {};
  const customer = body.customer || {};
  const items = Array.isArray(body.items) ? body.items : [];

  // 1. Basic checks.
  if (!customer.name || !customer.phone || !customer.address) {
    return res
      .status(400)
      .json({ error: "Please provide customer name, phone and address." });
  }
  if (items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  // 2. Rebuild each line from real product data + check the price.
  const orderLines = [];
  for (const item of items) {
    const product = db.getProductById(item.productId);
    if (!product) {
      return res
        .status(400)
        .json({ error: `Unknown product id: ${item.productId}` });
    }

    // Find the chosen weight (e.g. "250g") inside that product.
    const variant = product.wts.find((w) => w.w === item.weight);
    if (!variant) {
      return res.status(400).json({
        error: `Product "${product.name}" has no weight "${item.weight}".`,
      });
    }

    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1) {
      return res
        .status(400)
        .json({ error: `Quantity for "${product.name}" must be 1 or more.` });
    }

    orderLines.push({
      productId: product.id,
      name: product.name,
      weight: variant.w,
      price: variant.p, // price we trust, from our own data
      qty: qty,
      lineTotal: variant.p * qty,
    });
  }

  // 3. Add up the money (server-side, the source of truth).
  const subtotal = orderLines.reduce((sum, line) => sum + line.lineTotal, 0);

  if (subtotal < CONFIG.minOrder) {
    return res.status(400).json({
      error: `Minimum order is ₹${CONFIG.minOrder}. Your subtotal is ₹${subtotal}.`,
    });
  }

  const delivery = subtotal >= CONFIG.freeAbove ? 0 : CONFIG.deliveryFee;
  const total = subtotal + delivery;

  // 4. Build the order record and save it.
  const order = {
    id: "RZ" + Date.now(), // simple unique order number
    createdAt: new Date().toISOString(),
    status: "pending", // pending -> confirmed -> delivered
    customer: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      note: customer.note || "",
    },
    items: orderLines,
    subtotal,
    delivery,
    total,
  };

  db.saveOrder(order);

  // 5. Tell the website it worked, and send back the saved order.
  res.status(201).json({ ok: true, order });
});

module.exports = router;
