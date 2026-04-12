// backend/controllers/registrationController.js
const Registration = require("../models/Registration");
const Event        = require("../models/Event");

// Fallback fees if event.registrationFee is not set in DB
const TYPE_FEES = {
  Hackathon:  250,
  Workshop:   150,
  Webinar:    50,
  Conference: 300,
  Seminar:    100,
};

// ── POST /api/events/:id/register ───────────────────────────────────
// Body: { fullName, email, studentId, college, course, year, teamName?, teamSize?, userId }
exports.registerForEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const {
      fullName, email, studentId, college, course, year,
      teamName = "", teamSize = "",
      userId,
    } = req.body;

    // ── 1. validate required common fields ───────────────────────────
    if (!fullName || !email || !studentId || !college || !course || !year) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // ── 2. fetch event ────────────────────────────────────────────────
    const event = await Event.findById(eventId);
    if (!event || event.isDeleted) {
      return res.status(404).json({ message: "Event not found." });
    }

    // ── 3. seats check ────────────────────────────────────────────────
    if (event.seatsTaken >= event.totalSeats) {
      return res.status(400).json({ message: "Sorry, this event is full!" });
    }

    // ── 4. duplicate check ────────────────────────────────────────────
    const already = await Registration.findOne({ eventId, studentId });
    if (already) {
      return res.status(400).json({ message: "You have already registered for this event." });
    }

    // ── 5. save registration ──────────────────────────────────────────
    const reg = await Registration.create({
      eventId,
      fullName, email, studentId, college, course, year,
      teamName, teamSize,
      tokensPaid: event.registrationFee > 0
        ? event.registrationFee
        : (TYPE_FEES[event.eventType] || 0),
    });

    // ── 6. increment seatsTaken ───────────────────────────────────────
    event.seatsTaken += 1;
    await event.save();

    return res.status(201).json({
      message:       "Registration successful!",
      registration:  reg,
      seatsLeft:     event.totalSeats - event.seatsTaken,
      seatsTaken:    event.seatsTaken,
    });

  } catch (err) {
    // duplicate key from unique index
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already registered for this event." });
    }
    return res.status(500).json({ message: err.message });
  }
};

// ── GET /api/events/user/:userId/registrations ───────────────────────
// Returns all events a user has registered for
exports.getUserRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;
    // for now we match by studentId passed as userId
    const regs = await Registration.find({ studentId: userId }).populate("eventId");
    return res.json(regs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── GET /api/admin/participants/:eventId ──────────────────────────────
// (Used by Priyanka's admin panel)
exports.getParticipants = async (req, res) => {
  try {
    const regs = await Registration.find({ eventId: req.params.eventId });
    return res.json(regs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};