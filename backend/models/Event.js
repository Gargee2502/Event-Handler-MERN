// backend/models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true }, // e.g., "HackForge 2025"
  eventType: { type: String, required: true }, // e.g., "Hackathon"
  eventDescription: { type: String }, // e.g., "Join 500+ developers..."
  eventImage: { type: String }, // URL like "data:image/jpeg;base64,..."
  date: { type: String }, // e.g., "Mar 15-17"
  time: { type: String }, // e.g., "9:00 AM - 9:00 AM (+2 days)"
  venue: { type: String }, // e.g., "IT Campus"
  speaker: { type: String }, // e.g., "Dr. Rahul Sharma"
  organisedBy: { type: String }, // e.g., "TechClub ITD"
  totalSeats: { type: Number, required: true }, // e.g., 500
  seatsTaken: { type: Number, default: 0 }, // Starts at 0, increases on register
  isDeleted: { type: Boolean, default: false }, // For soft delete (admin can mark)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);