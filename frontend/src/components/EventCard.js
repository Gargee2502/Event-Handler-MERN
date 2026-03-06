// frontend/src/components/EventCard.js
import React from "react";
import { useNavigate } from "react-router-dom"; // To go to detail page

function EventCard({ event, onRegister, userId }) {
  const navigate = useNavigate();
  const remainingSeats = event.totalSeats - event.seatsTaken;

  const handleRegister = async () => {
    try {
      await onRegister(event._id, userId); // Call parent function to register and refresh
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div 
      style={{ 
        border: "1px solid #ccc", 
        borderRadius: "8px", 
        padding: "15px", 
        margin: "10px", 
        width: "250px", 
        backgroundColor: "#f9f9f9", 
        cursor: "pointer" 
      }}
      onClick={() => navigate(`/event/${event._id}`)} // Click card to go to details
    >
      <img 
        src={event.eventImage} 
        alt={event.eventName} 
        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} 
      />
      <h3 style={{ color: "#333" }}>{event.eventName}</h3>
      <p style={{ color: "#666" }}>{event.eventType}</p>
      <p style={{ color: "#666" }}>{event.date} | {event.time}</p>
      <p style={{ color: "#666" }}>{event.venue}</p>
      <p style={{ color: "#666" }}>Speaker: {event.speaker}</p>
      <p style={{ color: "#666" }}>
        {event.seatsTaken} / {event.totalSeats} registered
      </p>
      <button 
        disabled={remainingSeats <= 0} 
        onClick={(e) => { e.stopPropagation(); handleRegister(); }} // Stop card click
        style={{ 
          backgroundColor: remainingSeats > 0 ? "#4CAF50" : "#ccc", 
          color: "white", 
          padding: "10px", 
          border: "none", 
          borderRadius: "5px", 
          width: "100%", 
          cursor: remainingSeats > 0 ? "pointer" : "not-allowed" 
        }}
      >
        {remainingSeats > 0 ? "Register" : "Full"}
      </button>
    </div>
  );
}

export default EventCard;