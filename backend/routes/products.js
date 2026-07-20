// ============================================================
//  routes/products.js — everything under /api/products
// ============================================================

const express = require("express");
const db = require("../db");

const router = express.Router();

// List all products.
router.get("/", (req, res) => {
  res.json(db.getProducts());
});

// Get one product by its id, e.g. /api/products/3
router.get("/:id", (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

module.exports = router;
