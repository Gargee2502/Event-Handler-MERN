// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

// --- Public Routes ---
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP); 
router.post("/forgot-password", authController.forgotPassword); 
router.post("/reset-password", authController.resetPassword); 

// --- Protected Routes (Requires Login) ---
router.get("/me", authMiddleware, authController.getMe);
router.put("/update", authMiddleware, authController.updateUser);
router.post("/send-update-otp", authMiddleware, authController.sendUpdateOtp);

// Test route to verify role is working
router.get("/test", authMiddleware, (req, res) => {
    res.json({
        message: "Auth working!",
        user: req.user // Should now show: { id: ..., role: 'admin/student', ... }
    });
});

module.exports = router;