// ============================================================
//  db.js — our "database" is just two JSON files on disk.
//  This file gives us simple read/write helpers so the rest
//  of the code never has to think about files.
//
//  (When you outgrow JSON files, you can swap this one file
//   for a real database and nothing else has to change.)
// ============================================================

const fs = require("fs");
const path = require("path");

const PRODUCTS_FILE = path.join(__dirname, "data", "products.json");
const ORDERS_FILE = path.join(__dirname, "data", "orders.json");
const USERS_FILE = path.join(__dirname, "data", "users.json");

// Read a JSON file and turn it into a JavaScript value.
function readJson(file) {
  const text = fs.readFileSync(file, "utf8");
  return JSON.parse(text);
}

// Save a JavaScript value back into a JSON file (nicely indented).
function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

// ---- Products (read-only for the storefront) ----
function getProducts() {
  return readJson(PRODUCTS_FILE);
}

function getProductById(id) {
  return getProducts().find((p) => p.id === Number(id));
}

// ---- Orders ----
function getOrders() {
  return readJson(ORDERS_FILE);
}

function saveOrder(order) {
  const orders = getOrders();
  orders.push(order);
  writeJson(ORDERS_FILE, orders);
  return order;
}

// ---- Users (created the first time someone verifies an OTP) ----
function getUsers() {
  return readJson(USERS_FILE);
}

function getUserByIdentifier(identifier) {
  return getUsers().find((u) => u.identifier === identifier);
}

// Find the user by phone/email, or create one if this is their first login.
function findOrCreateUser(identifier) {
  const users = getUsers();
  let user = users.find((u) => u.identifier === identifier);
  if (!user) {
    user = { id: "U" + Date.now(), identifier, createdAt: new Date().toISOString() };
    users.push(user);
    writeJson(USERS_FILE, users);
  }
  return user;
}

module.exports = {
  getProducts,
  getProductById,
  getOrders,
  saveOrder,
  getUserByIdentifier,
  findOrCreateUser,
};
