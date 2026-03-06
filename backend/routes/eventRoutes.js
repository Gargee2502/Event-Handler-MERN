// backend/routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  registerEvent,
  getUserEvents,
  markAttended
} = require("../controllers/eventController");

// GET all events
router.get("/", getEvents);

// GET single event
router.get("/:id", getEventById);

// POST register for event
router.post("/:id/register", registerEvent);

// GET user's registered events
router.get("/user/:userId", getUserEvents);

// PUT mark attended
router.put("/:id/attended", markAttended);

module.exports = router;