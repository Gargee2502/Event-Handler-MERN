require("dotenv").config(); // Load environment variables first!
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Your new db.js file

// Initialize Database
connectDB();

const app = express();

// Middleware
app.use(cors());
// 🎯 CRITICAL: Set limits for Base64 images BEFORE routes
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});