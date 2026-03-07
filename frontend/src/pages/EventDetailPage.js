// frontend/src/pages/EventDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, registerForEvent } from "../services/eventServices.js";
import "./EventDetailPage.css";

const TYPE_CONFIG = {
  Hackathon:  { color: "#7c6fcd", bg: "#ede9ff", emoji: "🚀" },
  Workshop:   { color: "#2d8a4e", bg: "#d4f5e2", emoji: "🤖" },
  Webinar:    { color: "#c07a00", bg: "#fff0cc", emoji: "💡" },
  Conference: { color: "#1a6fa8", bg: "#cce8ff", emoji: "☁️" },
  Seminar:    { color: "#c0392b", bg: "#ffe8e8", emoji: "📚" },
};

function EventDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();

  // ── YOUR ORIGINAL LOGIC (unchanged) ──────────────────────────────────────
  const [event, setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = "mockUser123"; // Replace later

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventById(id);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      await registerForEvent(id, userId);
      alert("Registered successfully!");
      const res = await getEventById(id);
      setEvent(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="detail-layout">
      <div className="detail-card detail-card--loading">
        <div className="detail-skeleton-hero" />
        <div className="detail-skeleton-body">
          {[1,2,3,4].map(i => <div key={i} className="detail-skeleton-line" style={{width: `${90 - i*10}%`}} />)}
        </div>
      </div>
    </div>
  );

  if (!event) return (
    <div className="detail-layout">
      <div className="detail-card" style={{padding: 40, textAlign: "center"}}>
        <p style={{color:"#aaa"}}>Event not found</p>
        <button className="detail-back-btn" onClick={() => navigate("/")}>← Back to Events</button>
      </div>
    </div>
  );

  const cfg = TYPE_CONFIG[event.eventType] || { color: "#5b4fcf", bg: "#ede9ff", emoji: "📅" };
  const seatsLeft = event.totalSeats - event.seatsTaken;

  return (
    <div className="detail-layout">
      <div className="detail-card">
        {/* Hero */}
        <div className="detail-hero" style={{ background: `linear-gradient(135deg, ${cfg.bg} 0%, #f0eeff 100%)` }}>
          <span className="detail-hero__emoji">{cfg.emoji}</span>
          <span className="detail-hero__tag" style={{ color: cfg.color, background: "rgba(255,255,255,0.8)" }}>
            {event.eventType}
          </span>
        </div>

        {/* Body */}
        <div className="detail-body">
          {/* macOS dots */}
          <div className="detail-dots">
            <span style={{ background: "#ff5f57" }} />
            <span style={{ background: "#febc2e" }} />
            <span style={{ background: "#28c840" }} />
          </div>

          <h1 className="detail-title">{event.eventName}</h1>

          <div className="detail-row detail-row--date">
            <span>📅 {event.date}</span>
            {event.time && <><span className="detail-divider">|</span><span>⏰ {event.time}</span></>}
          </div>

          <p className="detail-desc">{event.eventDescription || "No description available."}</p>

          <div className="detail-info-box">
            <div>🏛️ Venue: {event.venue}</div>
            <div>🎤 Speaker: {event.speaker}</div>
            <div>🏫 Organiser: {event.organisedBy}</div>
            <div>👥 {event.seatsTaken} / {event.totalSeats} registered</div>
            <div>🎟️ Seats left: <strong style={{ color: seatsLeft > 0 ? cfg.color : "#c0392b" }}>{seatsLeft}</strong></div>
          </div>

          <button
            className="detail-register-btn"
            onClick={handleRegister}
            disabled={seatsLeft <= 0}
            style={seatsLeft > 0
              ? { background: cfg.color }
              : { background: "#eee", color: "#aaa", cursor: "not-allowed" }
            }
          >
            {seatsLeft > 0 ? "✅ Register Now" : "Event Full"}
          </button>

          <button className="detail-back-btn" onClick={() => navigate("/")}>
            ← Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;