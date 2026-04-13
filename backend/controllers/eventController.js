const Event = require('../models/Event');
const User = require('../models/User'); // Required for registrations and profile population

// 1. Create a new event
const createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. Get all active events (isDeleted: false)
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isDeleted: false });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get all soft-deleted events (isDeleted: true)
const getDeletedEvents = async (req, res) => {
  try {
    const events = await Event.find({ isDeleted: true });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get a single event by ID (for Edit Page)
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Update event details
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 6. Soft delete (move to trash)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.status(200).json({ message: 'Event moved to trash', event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 7. Restore from trash
const restoreEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isDeleted: false }, { new: true });
    res.status(200).json({ message: 'Event restored successfully', event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 8. Register for an Event (Student Logic)
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id; // From authMiddleware

    // 1. Add event to user's registered list
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { registeredEvents: eventId } },
      { new: true }
    );

    // 2. Increment seat count in Event model
    await Event.findByIdAndUpdate(
      eventId, 
      { $inc: { seatsTaken: 1 } }
    );

    res.json({ message: "Successfully registered!", user });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// 9. Get User's Registered Events (For Profile Page)
const getRegisteredEvents = async (req, res) => {
  try {
    // Populate details so the frontend shows names/dates, not just IDs
    const user = await User.findById(req.user.id).populate('registeredEvents');
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json(user.registeredEvents || []);
  } catch (error) {
    console.error("Error in getRegisteredEvents:", error);
    res.status(500).json({ message: "Could not fetch registered events" });
  }
};

// 🎯 THE EXPORTS: All functions must be here to be used in routes!
module.exports = {
  createEvent,
  getEvents,
  getDeletedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  restoreEvent,
  registerForEvent,
  getRegisteredEvents 
};