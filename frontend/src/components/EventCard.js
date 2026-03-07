// frontend/src/components/EventCard.js
import React from "react";
import "./EventCard.css";

const TYPE_CONFIG = {
  Hackathon:  { color: "#7c6fcd", bg: "#ede9ff", emoji: "🚀" },
  Workshop:   { color: "#2d8a4e", bg: "#d4f5e2", emoji: "🤖" },
  Webinar:    { color: "#c07a00", bg: "#fff0cc", emoji: "💡" },
  Conference: { color: "#1a6fa8", bg: "#cce8ff", emoji: "☁️" },
  Seminar:    { color: "#c0392b", bg: "#ffe8e8", emoji: "📚" },
};

function EventCard({ event, isRegistered, onOpen, style }) {
  const cfg   = TYPE_CONFIG[event.eventType] || TYPE_CONFIG.Seminar;
  const seats = event.totalSeats - event.seatsTaken;
  const isFull = seats <= 0;

  return (
    <div className="ecard" style={style} onClick={onOpen}>
      <div className="ecard__banner" style={{ background: cfg.bg }}>
        <span style={{ fontSize: 36 }}>{cfg.emoji}</span>
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
          <span className="ecard__div">|</span>
          <span>📍 {event.venue}</span>
        </div>
        <div className="ecard__row">🎤 {event.speaker}</div>
        <div className="ecard__row">🏫 {event.organisedBy}</div>

        <div className="ecard__foot">
          <button
            className="ecard__btn"
            style={
              isRegistered ? { background: cfg.bg, color: cfg.color }
              : isFull      ? { background: "#eee", color: "#aaa" }
              :                { background: cfg.color, color: "#fff" }
            }
            onClick={e => { e.stopPropagation(); onOpen(); }}
          >
            {isRegistered ? "✓ Registered" : isFull ? "Full" : "Register"}
          </button>
          <span className="ecard__seats">
            👥 {event.seatsTaken} / {event.totalSeats}
            {isFull && <span className="ecard__full-badge">FULL</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

export default EventCard;