// backend/routes/eventRoutes.js
// ⚠️ ORDER MATTERS — specific routes must come BEFORE /:id
const express = require("express");
const router  = express.Router();

const {
  getEvents,
  getEventById,
  getUserEvents,
  markAttended,
} = require("../controllers/eventController");

const {
  registerForEvent,
  getUserRegistrations,
  getParticipants,
} = require("../controllers/registrationController");

// ── Specific routes FIRST (before /:id) ──────────────────
router.get("/user/:userId/registrations",   getUserRegistrations);
router.get("/admin/participants/:eventId",  getParticipants);

// ── General routes AFTER ─────────────────────────────────
router.get("/",          getEvents);
router.get("/:id",       getEventById);
router.put("/:id/attended", markAttended);
router.post("/:id/register", registerForEvent);

module.exports = router;