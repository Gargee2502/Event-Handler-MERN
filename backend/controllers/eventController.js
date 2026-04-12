// backend/controllers/eventController.js
const Event = require("../models/Event");

// GET /api/events — all active events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isDeleted: false });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/:id — single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.isDeleted) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/user/:userId — events user joined
exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ seatsTaken: { $gt: 0 }, isDeleted: false });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/events/:id/attended — mark attendance
exports.markAttended = async (req, res) => {
  try {
    const { userId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Attendance marked for user " + userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};