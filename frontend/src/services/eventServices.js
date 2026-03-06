// frontend/src/services/eventService.js
import axios from "axios";

const API = "http://localhost:5000/api/events"; // Change to production URL later

export const getAllEvents = () => axios.get(API);

export const getEventById = (id) => axios.get(`${API}/${id}`);

export const registerForEvent = (eventId, userId) => 
  axios.post(`${API}/${eventId}/register`, { userId });

export const getUserEvents = (userId) => axios.get(`${API}/user/${userId}`);

export const markAttended = (eventId, userId) => 
  axios.put(`${API}/${eventId}/attended`, { userId });