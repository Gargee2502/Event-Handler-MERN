// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventID: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  eventName: { 
    type: String, 
    required: [true, 'Event name is required'], 
    trim: true 
  },
  eventType: { 
    type: String, 
    required: true,
    // 🎯 MATCHED TO SIDEBAR: Only these 3 will pass validation
    enum: ['Hackathon', 'Workshop', 'Seminar'], 
    default: 'Workshop'
  },
  eventImage: { 
    type: String, 
    default: '' 
  },
  eventDescription: { 
    type: String, 
    required: true, 
    maxLength: [500, 'Description is too long'] 
  },
  totalSeats: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  seatsTaken: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  totalParticipants: { 
    type: Number, 
    default: 0 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  venue: { 
    type: String, 
    required: true, 
    trim: true 
  },
  organisedBy: { 
    type: String, 
    required: true 
  },
  speaker: { 
    type: String, 
    required: true 
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true,
  // 🎯 VIRTUALS FIX: Allows seatsRemaining to be sent to the frontend
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Logic to calculate remaining seats dynamically
eventSchema.virtual('seatsRemaining').get(function() {
  return this.totalSeats - this.seatsTaken;
});

module.exports = mongoose.model('Event', eventSchema);