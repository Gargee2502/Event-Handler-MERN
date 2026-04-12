// frontend/src/services/eventService.js
import axios from "axios";

const API = "http://localhost:5000/api/events";

export const getAllEvents  = ()        => axios.get(API);
export const getEventById = (id)       => axios.get(`${API}/${id}`);
export const getUserEvents = (userId)  => axios.get(`${API}/user/${userId}`);
export const markAttended  = (id, uid) => axios.put(`${API}/${id}/attended`, { userId: uid });

// ── registerForEvent ──────────────────────────────────────────────────
// formData = { fullName, email, studentId, college, course, year, teamName?, teamSize? }
export const registerForEvent = (eventId, formData) =>
  axios.post(`${API}/${eventId}/register`, formData);

// ── getUserRegistrations ──────────────────────────────────────────────
export const getUserRegistrations = (userId) =>
  axios.get(`${API}/user/${userId}/registrations`);