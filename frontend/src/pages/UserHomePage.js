// frontend/src/pages/UserHomePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../services/eventServices.js";
import FilterSidebar from "../components/FilterSidebar.js";
import EventCard from "../components/EventCard.js";
import "./UserHomePage.css";

const ITEMS_PER_PAGE = 3;

const TYPE_CONFIG = {
  Hackathon:  { color: "#7c6fcd", bg: "#ede9ff", emoji: "🚀", fee: 250 },
  Workshop:   { color: "#2d8a4e", bg: "#d4f5e2", emoji: "🤖", fee: 150 },
  Webinar:    { color: "#c07a00", bg: "#fff0cc", emoji: "💡", fee: 50  },
  Conference: { color: "#1a6fa8", bg: "#cce8ff", emoji: "☁️", fee: 300 },
  Seminar:    { color: "#c0392b", bg: "#ffe8e8", emoji: "📚", fee: 100 },
};

function UserHomePage() {
  const navigate = useNavigate();

  const [events,         setEvents]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [selectedEvent,  setSelectedEvent]  = useState(null);
  const [activeTab,      setActiveTab]      = useState("discover"); // "discover" | "registered"
  const [selectedTypes,  setSelectedTypes]  = useState([]);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [orgSearch,      setOrgSearch]      = useState("");

  const [userTokens, setUserTokens] = useState(
    () => Number(localStorage.getItem("userTokens") ?? 1000)
  );
  const [registeredIds, setRegisteredIds] = useState(
    () => new Set(JSON.parse(localStorage.getItem("registeredIds") ?? "[]"))
  );

  useEffect(() => {
    const sync = () => {
      setUserTokens(Number(localStorage.getItem("userTokens") ?? 1000));
      setRegisteredIds(new Set(JSON.parse(localStorage.getItem("registeredIds") ?? "[]")));
    };
    window.addEventListener("focus", sync);
    sync();
    return () => window.removeEventListener("focus", sync);
  }, []);

  useEffect(() => {
    getAllEvents()
      .then(res => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleFilter = (val, arr, setter) => {
    const s = new Set(arr);
    s.has(val) ? s.delete(val) : s.add(val);
    setter([...s]);
    setCurrentPage(1);
  };

  // ── Split events into two lists ──────────────────────────────────
  const unregisteredEvents = events.filter(e => !registeredIds.has(e._id));
  const registeredEvents   = events.filter(e =>  registeredIds.has(e._id));

  // ── Apply filters only to discover tab ──────────────────────────
  const applyFilters = (list) => list.filter(e => {
    const tOk = selectedTypes.length  === 0 || selectedTypes.includes(e.eventType);
    const vOk = selectedVenues.length === 0 || selectedVenues.includes(
      e.venue?.toLowerCase().includes("online") ? "Online"
      : e.venue?.toLowerCase().includes("hybrid") ? "Hybrid"
      : "Offline"
    );
    const oOk = !orgSearch || e.organisedBy?.toLowerCase().includes(orgSearch.toLowerCase());
    return tOk && vOk && oOk;
  });

  const displayList   = activeTab === "discover"
    ? applyFilters(unregisteredEvents)
    : registeredEvents;

  const totalPages = Math.max(1, Math.ceil(displayList.length / ITEMS_PER_PAGE));
  const paginated  = displayList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const activeTags = [...selectedTypes, ...selectedVenues];

  const switchTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedEvent(null);
  };

  return (
    <div className="home-layout">
      <div className={`home-card ${selectedEvent ? "home-card--split" : ""}`}>

        {/* ── Navbar ── */}
        <nav className="navbar">
          <div className="navbar__brand">
            <span className="navbar__dot" />
            <span className="navbar__logo">Event Handler</span>
          </div>
          <div className="navbar__right">
            <div className="token-badge">
              <span>🪙</span>
              <span className="token-badge__count">{userTokens.toLocaleString()}</span>
              <span className="token-badge__label">tokens</span>
            </div>
            <div className="navbar__avatar">JD</div>
          </div>
        </nav>

        {/* ── Tabs ── */}
        <div className="home-tabs">
          <button
            className={`tab-btn ${activeTab === "discover" ? "tab-btn--active" : ""}`}
            onClick={() => switchTab("discover")}
          >
            🔍 Discover Events
            <span className="tab-count">{unregisteredEvents.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "registered" ? "tab-btn--active tab-btn--green" : ""}`}
            onClick={() => switchTab("registered")}
          >
            ✅ My Registrations
            <span className="tab-count tab-count--green">{registeredEvents.length}</span>
          </button>
        </div>

        <div className="home-body">
          {/* ── Sidebar (only on discover tab) ── */}
          {activeTab === "discover" && (
            <FilterSidebar
              selectedTypes={selectedTypes}
              setSelectedTypes={t => { setSelectedTypes(t); setCurrentPage(1); }}
              selectedVenues={selectedVenues}
              setSelectedVenues={v => { setSelectedVenues(v); setCurrentPage(1); }}
              orgSearch={orgSearch}
              setOrgSearch={v => { setOrgSearch(v); setCurrentPage(1); }}
              toggleFilter={toggleFilter}
            />
          )}

          {/* ── Event list ── */}
          <div className="home-main">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="skeleton-row" />)
            ) : (
              <>
                {/* meta row */}
                <div className="home-meta">
                  <span className="home-count">
                    {activeTab === "discover"
                      ? <><b>{displayList.length}</b> events available{activeTags.length > 0 && " · Filtered by:"}</>
                      : <><b>{displayList.length}</b> event{displayList.length !== 1 ? "s" : ""} registered</>
                    }
                  </span>
                  {activeTab === "discover" && (
                    <div className="home-tags">
                      {activeTags.map(t => <span key={t} className="home-tag">{t}</span>)}
                    </div>
                  )}
                </div>

                {/* empty states */}
                {paginated.length === 0 && activeTab === "discover" && (
                  <div className="home-empty">No events match your filters 😕</div>
                )}
                {paginated.length === 0 && activeTab === "registered" && (
                  <div className="home-empty">
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎟️</div>
                    <div>You haven't registered for any events yet.</div>
                    <button className="empty-discover-btn" onClick={() => switchTab("discover")}>
                      Browse Events →
                    </button>
                  </div>
                )}

                {/* event cards */}
                {paginated.map((ev, i) => (
                  <EventCard
                    key={ev._id}
                    event={ev}
                    style={{ animationDelay: `${i * 0.07}s` }}
                    isRegistered={activeTab === "registered"}
                    isSelected={selectedEvent?._id === ev._id}
                    onOpen={() => setSelectedEvent(selectedEvent?._id === ev._id ? null : ev)}
                  />
                ))}

                {/* pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p}
                        className={`page-btn ${currentPage === p ? "page-btn--active" : ""}`}
                        onClick={() => setCurrentPage(p)}>{p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Detail panel ── */}
          {selectedEvent && (
            <DetailPanel
              event={selectedEvent}
              userTokens={userTokens}
              isRegistered={registeredIds.has(selectedEvent._id)}
              onClose={() => setSelectedEvent(null)}
              onRegister={() => navigate(`/event/${selectedEvent._id}/register`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel ─────────────────────────────────────────────────────
function DetailPanel({ event, userTokens, isRegistered, onClose, onRegister }) {
  const cfg       = TYPE_CONFIG[event.eventType] || TYPE_CONFIG.Seminar;
  const fee       = (event.registrationFee > 0) ? event.registrationFee : cfg.fee;
  const seatsLeft = event.totalSeats - event.seatsTaken;
  const isFull    = seatsLeft <= 0;
  const canAfford = userTokens >= fee;

  return (
    <div className="detail-panel">
      <div className="dp-hero" style={{ background: `linear-gradient(135deg,${cfg.bg},#f0eeff)` }}>
        <button className="dp-close" onClick={onClose}>✕</button>
        <span className="dp-emoji">{cfg.emoji}</span>
        <span className="dp-tag" style={{ color: cfg.color, background: "rgba(255,255,255,0.82)" }}>
          {event.eventType}
        </span>
      </div>

      <div className="dp-body">
        <div className="dp-dots">
          <span style={{ background: "#ff5f57" }} />
          <span style={{ background: "#febc2e" }} />
          <span style={{ background: "#28c840" }} />
        </div>

        <h2 className="dp-title">{event.eventName}</h2>

        <div className="dp-row">
          <span>📅 {event.date}</span>
          {event.time && <><span className="dp-div">|</span><span>⏰ {event.time}</span></>}
        </div>

        <p className="dp-desc">{event.eventDescription || "No description available."}</p>

        <div className="dp-info">
          <div>🏛️ <b>{event.venue}</b></div>
          <div>🎤 <b>{event.speaker}</b></div>
          <div>🏫 <b>{event.organisedBy}</b></div>
          <div>
            👥 {event.seatsTaken} / {event.totalSeats} &nbsp;·&nbsp;
            <b style={{ color: seatsLeft > 20 ? "#2d8a4e" : seatsLeft > 0 ? "#c07a00" : "#c0392b" }}>
              {isFull ? "FULL" : `${seatsLeft} left`}
            </b>
          </div>
        </div>

        <div className="dp-cost">
          <span>🪙 <b>{fee}</b> tokens fee</span>
          <span style={{ color: canAfford ? "#2d8a4e" : "#c0392b", fontWeight: 700 }}>
            Balance: {userTokens} 🪙
          </span>
        </div>

        {isRegistered ? (
          <button className="dp-btn dp-btn--done" disabled>✅ Already Registered</button>
        ) : (
          <button
            className="dp-btn dp-btn--primary"
            style={{ background: (!canAfford || isFull) ? "#ccc" : cfg.color }}
            disabled={!canAfford || isFull}
            onClick={onRegister}
          >
            {isFull ? "Event Full" : !canAfford ? "Insufficient Tokens" : "Fill Registration Form →"}
          </button>
        )}

        <button className="dp-btn dp-btn--ghost" onClick={onClose}>← Close</button>
      </div>
    </div>
  );
}

export default UserHomePage;