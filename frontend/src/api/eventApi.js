// frontend/src/api/eventApi.js
import axios from 'axios';

// Set the base URL for your backend server
const API = axios.create({
  baseURL: 'http://localhost:5000/api/events',
});

// GET all active events
export const fetchEvents = () => API.get('/');

// POST a new event
export const createEvent = (newEvent) => API.post('/', newEvent);

// GET a single event by ID for the Edit Page
export const fetchEventById = (id) => API.get(`/${id}`); 

// PUT to update event details
export const updateEvent = (id, updatedData) => API.put(`/${id}`, updatedData); 

// PATCH to soft delete (moves to trash)
export const deleteEvent = (id) => API.patch(`/${id}/delete`);

// PATCH to restore (moves back to dashboard)
export const restoreEvent = (id) => API.patch(`/${id}/restore`);

// GET only events that are marked as deleted
export const fetchDeletedEvents = () => API.get('/trash');