// frontend/src/pages/RegisteredEventsPage.js
import React, { useEffect, useState } from "react";
import { getUserEvents } from "../services/eventServices.js";
import { useNavigate } from "react-router-dom";
import "./RegisteredEventsPage.css";

const TYPE_CONFIG = {
  Hackathon:  { color: "#7c6fcd", bg: "#ede9ff", emoji: "🚀" },
  Workshop:   { color: "#2d8a4e", bg: "#d4f5e2", emoji: "🤖" },
  Webinar:    { color: "#c07a00", bg: "#fff0cc", emoji: "💡" },
  Conference: { color: "#1a6fa8", bg: "#cce8ff", emoji: "☁️" },
  Seminar:    { color: "#c0392b", bg: "#ffe8e8", emoji: "📚" },
};

function RegisteredEventsPage() {
  const navigate = useNavigate();

  // ── YOUR ORIGINAL LOGIC (unchanged) ──────────────────────────────────────
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "mockUser123";

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const res = await getUserEvents(userId);
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserEvents();
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="reg-layout">
      <div className="reg-wrap">
        {/* Navbar */}
        <nav className="reg-nav">
          <div className="reg-nav__brand">
            <span className="reg-nav__dot" />
            <span className="reg-nav__logo">Event Handler</span>
          </div>
          <button className="reg-nav__back" onClick={() => navigate("/")}>
            ← All Events
          </button>
        </nav>

        <div className="reg-body">
          <h2 className="reg-heading">🎟️ Your Registered Events</h2>
          <p className="reg-sub">Events you've signed up for</p>

          {loading && (
            <div className="reg-skeleton">
              {[1,2,3].map(i => <div key={i} className="reg-skeleton-row" />)}
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="reg-empty">
              <span style={{fontSize: 48}}>📭</span>
              <p>You haven't registered for any events yet.</p>
              <button className="reg-browse-btn" onClick={() => navigate("/")}>Browse Events</button>
            </div>
          )}

          {!loading && events.map((event) => {
            const cfg = TYPE_CONFIG[event.eventType] || { color: "#5b4fcf", bg: "#ede9ff", emoji: "📅" };
            return (
              <div
                key={event._id}
                className="reg-card"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <div className="reg-card__banner" style={{ background: cfg.bg }}>
                  <span style={{ fontSize: 32 }}>{cfg.emoji}</span>
                </div>
                <div className="reg-card__content">
                  <div className="reg-card__top">
                    <h3 className="reg-card__title">{event.eventName}</h3>
                    <span className="reg-card__tag" style={{ color: cfg.color, background: cfg.bg }}>
                      {event.eventType}
                    </span>
                  </div>
                  <div className="reg-card__meta">📅 {event.date} &nbsp;|&nbsp; 📍 {event.venue}</div>
                  <div className="reg-card__meta">🎤 {event.speaker}</div>
                  <span className="reg-card__badge">✓ Registered</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RegisteredEventsPage;