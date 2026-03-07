// frontend/src/components/EventCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./EventCard.css";

const TYPE_CONFIG = {
  Hackathon:  { color: "#7c6fcd", bg: "#ede9ff", emoji: "🚀" },
  Workshop:   { color: "#2d8a4e", bg: "#d4f5e2", emoji: "🤖" },
  Webinar:    { color: "#c07a00", bg: "#fff0cc", emoji: "💡" },
  Conference: { color: "#1a6fa8", bg: "#cce8ff", emoji: "☁️" },
  Seminar:    { color: "#c0392b", bg: "#ffe8e8", emoji: "📚" },
};

function EventCard({ event, onRegister, userId }) {
  const navigate = useNavigate();

  // ── YOUR ORIGINAL LOGIC (unchanged) ──────────────────────────────────────
  const remainingSeats = event.totalSeats - event.seatsTaken;

  const handleRegister = async () => {
    try {
      await onRegister(event._id, userId);
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  const cfg = TYPE_CONFIG[event.eventType] || { color: "#5b4fcf", bg: "#ede9ff", emoji: "📅" };

  return (
    <div
      className="ecard"
      onClick={() => navigate(`/event/${event._id}`)}
    >
      {/* emoji banner */}
      <div className="ecard__banner" style={{ background: cfg.bg }}>
        <span className="ecard__emoji">{cfg.emoji}</span>
      </div>

      <div className="ecard__body">
        <div className="ecard__top">
          <h3 className="ecard__title">{event.eventName}</h3>
          <span className="ecard__tag" style={{ color: cfg.color, background: cfg.bg }}>
            {event.eventType}
          </span>
        </div>

        <div className="ecard__row">
          <span>📅 {event.date}</span>
          {event.time && <><span className="ecard__divider">|</span><span>⏰ {event.time}</span></>}
        </div>
        <div className="ecard__row">📍 {event.venue}</div>
        <div className="ecard__row">🎤 Speaker: {event.speaker}</div>
        <div className="ecard__row">🏫 Organised by: {event.organisedBy}</div>

        <div className="ecard__footer">
          <button
            className="ecard__btn"
            disabled={remainingSeats <= 0}
            style={
              remainingSeats > 0
                ? { background: cfg.color, color: "#fff" }
                : { background: "#eee", color: "#aaa" }
            }
            onClick={(e) => { e.stopPropagation(); handleRegister(); }}
          >
            {remainingSeats > 0 ? "Register" : "Full"}
          </button>
          <span className="ecard__count">
            👥 {event.seatsTaken} / {event.totalSeats} registered
          </span>
        </div>
      </div>
    </div>
  );
}

export default EventCard;