const User = require("../models/User"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ======================
// SIGNUP
// ======================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ email });

    if (user) {
      if (user.verified) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        user.name = name;
        user.password = hashedPassword;
        user.otp = otp;
        await user.save();
      }
    } else {
      user = new User({ name, email, password: hashedPassword, otp, verified: false });
      await user.save();
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "Signup successful. OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// VERIFY OTP (Includes Role in JWT and Response)
// ======================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.verified = true;
    user.otp = null;
    await user.save();

    // 🎯 Include role in JWT for access control
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({
      message: "Account verified successfully",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role // 🎯 Ensure role is returned
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// LOGIN (Includes Role in JWT and Response)
// ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.verified) return res.status(401).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // 🎯 Include role in JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role // 🎯 Role MUST be here for AdminRoute to work
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// GET ME (Populates Events)
// ======================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate('registeredEvents'); // Population for Profile view
      
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// UPDATE USER PROFILE (Includes New Fields)
// ==========================================
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, otp, phone, college, year } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Update Profile Information
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (college) user.college = college;
    if (year) user.year = year;

    // 2. Handle Email Change (Requires OTP Verification)
    if (email && email !== user.email) {
      if (!otp || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP for email verification" });

      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: "Email is already in use" });

      user.email = email;
      user.otp = null;
    }

    // 3. Handle Password Change
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        phone: user.phone,
        college: user.college,
        year: user.year 
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// ==========================================
// MISC AUTH FUNCTIONS
// ==========================================

exports.sendUpdateOtp = async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ message: "New email is required" });

    const existingEmail = await User.findOne({ email: newEmail });
    if (existingEmail) return res.status(400).json({ message: "Email is already in use" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: "Verify your new email address",
      text: `Your OTP to change your email is ${otp}`
    });

    res.json({ message: "OTP sent to new email" });
  } catch (error) {
    res.status(500).json({ message: "Server error while sending OTP" });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resend OTP Verification",
      text: `Your new OTP is ${otp}`
    });

    res.json({ message: "A new OTP has been sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP to reset your password is ${otp}`
    });

    res.json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null; 
    await user.save();

    res.json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};