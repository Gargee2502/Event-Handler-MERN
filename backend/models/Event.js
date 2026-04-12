// backend/models/Event.js  (keep your existing fields, just paste this)
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName:        { type: String, required: true },
  eventType:        { type: String, required: true },   // Hackathon | Workshop | Webinar | Conference | Seminar
  eventDescription: { type: String },
  eventImage:       { type: String },
  date:             { type: String },
  time:             { type: String },
  venue:            { type: String },
  speaker:          { type: String },
  organisedBy:      { type: String },
  totalSeats:       { type: Number, required: true },
  seatsTaken:       { type: Number, default: 0 },       // incremented on each registration
  registrationFee:  { type: Number, default: 0 },       // tokens cost
  isDeleted:        { type: Boolean, default: false },
  createdAt:        { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);