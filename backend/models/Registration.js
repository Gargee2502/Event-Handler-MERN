// backend/models/Registration.js
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  // Which event
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  // Common fields (every category)
  fullName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  studentId: { type: String, required: true, trim: true },
  college:   { type: String, required: true, trim: true },
  course:    { type: String, required: true },   // B.Tech, B.Sc, BCA ...
  year:      { type: String, required: true },   // 1st Year, 2nd Year ...

  // Hackathon / Conference extra fields (optional for other types)
  teamName: { type: String, default: "" },
  teamSize: { type: String, default: "" },   // "1 (Solo)", "2", "3", "4"

  // Token payment
  tokensPaid: { type: Number, required: true, default: 0 },

  // Meta
  registeredAt: { type: Date, default: Date.now },
});

// Prevent same student from registering twice for the same event
registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });
registrationSchema.index({ eventId: 1, email:     1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);