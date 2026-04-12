// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import all routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);    // From your base branch
app.use("/api/events", eventRoutes); // From Gargee's branch

// ── Test route (visit http://localhost:5000/api/test) ───
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// ── MongoDB ─────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

// ── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});