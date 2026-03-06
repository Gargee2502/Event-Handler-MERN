// backend/controllers/eventController.js
const Event = require("../models/Event");

// GET all events (for home page)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();   // ← remove { isDeleted: false }
    console.log("Found events:", events.length);  // ← add this log
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single event by ID (for detail page)
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

// POST register for event (increments seatsTaken)
exports.registerEvent = async (req, res) => {
  try {
    const { userId } = req.body; // Later from auth; mock for now
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }
    const event = await Event.findById(req.params.id);
    if (!event || event.isDeleted) {
      return res.status(404).json({ message: "Event not found" });
    }
    const remainingSeats = event.totalSeats - event.seatsTaken;
    if (remainingSeats <= 0) {
      return res.status(400).json({ message: "Event is full!" });
    }
    event.seatsTaken += 1;
    await event.save();
    res.json({ message: "Registration successful!", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET user's registered events (mock for now; later link to user model)
exports.getUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    // TODO: Real query when user-event registration model is added
    // For now, mock: return all events with seatsTaken > 0 (assuming user registered in some)
    const events = await Event.find({ seatsTaken: { $gt: 0 }, isDeleted: false });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT mark attended (for admin/attendance; basic logic)
exports.markAttended = async (req, res) => {
  try {
    const { userId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // TODO: Real attendance tracking (e.g., decrement if no-show or mark user)
    // For now, just log it
    res.json({ message: "Attendance marked for user " + userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};