const express = require('express');
const router = express.Router();
const { 
  createEvent, getEvents, getEventById, getDeletedEvents, 
  updateEvent, deleteEvent, restoreEvent, registerForEvent 
} = require('../controllers/eventController');

const authMiddleware = require('../middleware/authMiddleware'); //
const adminMiddleware = require('../middleware/adminMiddleware');

// --- ROUTES ---

router.route('/')
  .get(getEvents) // Public
  .post(authMiddleware, adminMiddleware, createEvent); // 🔒 Admin Only

router.get('/trash', authMiddleware, adminMiddleware, getDeletedEvents); // 🔒 Admin Only

router.route('/:id')
  .get(getEventById)
  .put(authMiddleware, adminMiddleware, updateEvent); // 🔒 Admin Only

router.patch('/:id/delete', authMiddleware, adminMiddleware, deleteEvent);
router.patch('/:id/restore', authMiddleware, adminMiddleware, restoreEvent);

// 🎓 Student Registration
router.post('/:eventId/register', authMiddleware, registerForEvent);

module.exports = router;