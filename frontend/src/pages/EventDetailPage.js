// frontend/src/pages/EventDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../services/eventServices.js";
import "./EventDetailPage.css";

const TYPE_CONFIG = {
  Hackathon:  { color: "#7c6fcd", bg: "#ede9ff", emoji: "🚀", fee: 250 },
  Workshop:   { color: "#2d8a4e", bg: "#d4f5e2", emoji: "🤖", fee: 150 },
  Webinar:    { color: "#c07a00", bg: "#fff0cc", emoji: "💡", fee: 50  },
  Conference: { color: "#1a6fa8", bg: "#cce8ff", emoji: "☁️", fee: 300 },
  Seminar:    { color: "#c0392b", bg: "#ffe8e8", emoji: "📚", fee: 100 },
};

function EventDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [event,   setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);

  const userTokens    = Number(localStorage.getItem("userTokens") ?? 1000);
  const registeredIds = new Set(JSON.parse(localStorage.getItem("registeredIds") ?? "[]"));
  const isRegistered  = registeredIds.has(id);

  useEffect(() => {
    getEventById(id)
      .then(res => setEvent(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="detail-layout">
      <div className="detail-card">
        <div className="detail-skeleton-hero" />
        <div style={{ padding: 24 }}>
          {[90, 70, 55, 40].map(w => (
            <div key={w} className="detail-skeleton-line" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!event) return (
    <div className="detail-layout">
      <div className="detail-card" style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "#aaa", marginBottom: 20 }}>Event not found.</p>
        <button className="btn btn--ghost" onClick={() => navigate("/")}>← Back</button>
      </div>
    </div>
  );

  const cfg = TYPE_CONFIG[event.eventType] || TYPE_CONFIG.Seminar;

  // ✅ FIX: use registrationFee from DB only if > 0, else fallback to TYPE_CONFIG fee
  const fee = (event.registrationFee && event.registrationFee > 0)
    ? event.registrationFee
    : cfg.fee;

  const seatsLeft = event.totalSeats - event.seatsTaken;
  const isFull    = seatsLeft <= 0;
  const canAfford = userTokens >= fee;

  return (
    <div className="detail-layout">
      <div className="detail-card">

        {/* Hero */}
        <div className="detail-hero"
          style={{ background: `linear-gradient(135deg, ${cfg.bg} 0%, #f0eeff 100%)` }}>
          <span className="detail-hero__emoji">{cfg.emoji}</span>
          <span className="detail-hero__tag"
            style={{ color: cfg.color, background: "rgba(255,255,255,0.82)" }}>
            {event.eventType}
          </span>
        </div>

        <div className="detail-body">
          <div className="detail-dots">
            <span style={{ background: "#ff5f57" }} />
            <span style={{ background: "#febc2e" }} />
            <span style={{ background: "#28c840" }} />
          </div>

          <h1 className="detail-title">{event.eventName}</h1>

          <div className="detail-row">
            <span>📅 {event.date}</span>
            {event.time && (
              <><span className="detail-divider">|</span><span>⏰ {event.time}</span></>
            )}
          </div>

          <p className="detail-desc">
            {event.eventDescription || "No description available."}
          </p>

          <div className="detail-info">
            <div>🏛️ Venue: <b>{event.venue}</b></div>
            <div>🎤 Speaker: <b>{event.speaker}</b></div>
            <div>🏫 Organiser: <b>{event.organisedBy}</b></div>
            <div>
              👥 {event.seatsTaken} / {event.totalSeats} registered &nbsp;·&nbsp;
              <b style={{ color: seatsLeft > 20 ? "#2d8a4e" : seatsLeft > 0 ? "#c07a00" : "#c0392b" }}>
                {isFull ? "FULL" : `${seatsLeft} seats left`}
              </b>
            </div>
          </div>

          {/* ✅ FIX: Token cost — now shows correct fee */}
          <div className="detail-cost">
            <div className="detail-cost__left">
              <span style={{ fontSize: 22 }}>🪙</span>
              <div>
                <div className="detail-cost__fee">{fee} tokens</div>
                <div className="detail-cost__label">Registration fee</div>
              </div>
            </div>
            <div className="detail-cost__right">
              <div className="detail-cost__balance">
                Your balance: <b>{userTokens} 🪙</b>
              </div>
              {!canAfford && !isRegistered && (
                <div className="detail-cost__warn">⚠️ Insufficient tokens</div>
              )}
            </div>
          </div>

          {/* CTA */}
          {isRegistered ? (
            <button className="btn btn--registered" disabled>✅ Already Registered</button>
          ) : (
            <button
              className="btn btn--primary"
              style={{ background: (!canAfford || isFull) ? "#bbb" : cfg.color }}
              disabled={!canAfford || isFull}
              onClick={() => navigate(`/event/${id}/register`, {
                // ✅ pass fee via state so RegistrationPage uses same value
                state: { fee }
              })}
            >
              {isFull
                ? "Event is Full"
                : !canAfford
                ? "Not Enough Tokens"
                : "Fill Registration Form →"}
            </button>
          )}

          <button className="btn btn--ghost" onClick={() => navigate("/")}>
            ← Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;