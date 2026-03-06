// frontend/src/pages/EventDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById, registerForEvent } from "../services/eventServices.js";

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = "mockUser123"; // Replace later

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventById(id);
        setEvent(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      await registerForEvent(id, userId);
      alert("Registered successfully!");
      // Refetch to update count
      const res = await getEventById(id);
      setEvent(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading event...</p>;
  if (!event) return <p style={{ textAlign: "center", marginTop: "50px" }}>Event not found</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Link to="/" style={{ color: "#4CAF50", textDecoration: "none" }}>← Back to Events</Link>
      <img 
        src={event.eventImage} 
        alt={event.eventName} 
        style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px", marginTop: "20px" }} 
      />
      <h1 style={{ color: "#333" }}>{event.eventName}</h1>
      <p style={{ color: "#666" }}>{event.eventDescription}</p>
      <p style={{ color: "#666" }}>{event.eventType}</p>
      <p style={{ color: "#666" }}>{event.date} | {event.time}</p>
      <p style={{ color: "#666" }}>{event.venue}</p>
      <p style={{ color: "#666" }}>Speaker: {event.speaker}</p>
      <p style={{ color: "#666" }}>Organised by: {event.organisedBy}</p>
      <p style={{ color: "#666" }}>
        {event.seatsTaken} / {event.totalSeats} registered
      </p>
      <button 
        onClick={handleRegister} 
        disabled={event.totalSeats - event.seatsTaken <= 0}
        style={{ 
          backgroundColor: event.totalSeats - event.seatsTaken > 0 ? "#4CAF50" : "#ccc", 
          color: "white", 
          padding: "15px", 
          border: "none", 
          borderRadius: "5px", 
          width: "100%", 
          fontSize: "16px", 
          cursor: event.totalSeats - event.seatsTaken > 0 ? "pointer" : "not-allowed" 
        }}
      >
        {event.totalSeats - event.seatsTaken > 0 ? "Register Now" : "Event Full"}
      </button>
    </div>
  );
}

export default EventDetailPage;