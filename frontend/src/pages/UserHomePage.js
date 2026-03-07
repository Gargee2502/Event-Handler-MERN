// frontend/src/pages/UserHomePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../services/eventServices.js";
import FilterSidebar from "../components/FilterSidebar.js";
import EventCard from "../components/EventCard.js";
import "./UserHomePage.css";

const ITEMS_PER_PAGE = 6;

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
  const [activeTab,      setActiveTab]      = useState("discover");
  const [selectedTypes,  setSelectedTypes]  = useState([]);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [orgSearch,      setOrgSearch]      = useState("");

  const [userTokens, setUserTokens] = useState(
    () => Number(localStorage.getItem("userTokens") ?? 10000)
  );
  const [registeredIds, setRegisteredIds] = useState(
    () => new Set(JSON.parse(localStorage.getItem("registeredIds") ?? "[]"))
  );

  useEffect(() => {
    const sync = () => {
      setUserTokens(Number(localStorage.getItem("userTokens") ?? 10000));
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

  const unregisteredEvents = events.filter(e => !registeredIds.has(e._id));
  const registeredEvents   = events.filter(e =>  registeredIds.has(e._id));

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

  const displayList = activeTab === "discover"
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
    <div className="home-root">

      {/* ── Top Navbar ── */}
      <nav className="top-nav">
        <div className="top-nav__brand">
          <span className="top-nav__dot" />
          <span className="top-nav__logo">Event Handler</span>
        </div>
        <div className="top-nav__center">
          <button className={`top-nav__tab ${activeTab === "discover" ? "top-nav__tab--active" : ""}`}
            onClick={() => switchTab("discover")}>
            🔍 Discover Events
            <span className="nav-badge">{unregisteredEvents.length}</span>
          </button>
          <button className={`top-nav__tab ${activeTab === "registered" ? "top-nav__tab--active top-nav__tab--green" : ""}`}
            onClick={() => switchTab("registered")}>
            ✅ My Registrations
            <span className="nav-badge nav-badge--green">{registeredEvents.length}</span>
          </button>
        </div>
        <div className="top-nav__right">
          <div className="token-pill">
            <span>🪙</span>
            <span className="token-pill__val">{userTokens.toLocaleString()}</span>
            <span className="token-pill__lbl">TOKENS</span>
          </div>
          <div className="nav-avatar">JD</div>
        </div>
      </nav>

      {/* ── Page heading ── */}
      <div className="home-heading">
        <h1>{activeTab === "discover" ? "Manage Events" : "My Registered Events"}</h1>
        {activeTab === "discover" && activeTags.length > 0 && (
          <div className="heading-tags">
            {activeTags.map(t => <span key={t} className="heading-tag">{t}</span>)}
          </div>
        )}
      </div>

      {/* ── Main body ── */}
      <div className="home-body">

        {/* Sidebar — only on discover */}
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

        {/* Event grid */}
        <div className={`home-content ${activeTab === "registered" ? "home-content--full" : ""}`}>
          {loading ? (
            <div className="event-grid">
              {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <>
              <p className="result-count">
                {activeTab === "discover"
                  ? <><b>{displayList.length}</b> events available</>
                  : <><b>{displayList.length}</b> event{displayList.length !== 1 ? "s" : ""} registered</>
                }
              </p>

              {paginated.length === 0 && activeTab === "discover" && (
                <div className="empty-state">No events match your filters 😕</div>
              )}
              {paginated.length === 0 && activeTab === "registered" && (
                <div className="empty-state">
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🎟️</div>
                  <p>You haven't registered for any events yet.</p>
                  <button className="browse-btn" onClick={() => switchTab("discover")}>
                    Browse Events →
                  </button>
                </div>
              )}

              <div className="event-grid">
                {paginated.map((ev, i) => (
                  <EventCard
                    key={ev._id}
                    event={ev}
                    style={{ animationDelay: `${i * 0.06}s` }}
                    isRegistered={activeTab === "registered"}
                    isSelected={selectedEvent?._id === ev._id}
                    onOpen={() => setSelectedEvent(selectedEvent?._id === ev._id ? null : ev)}
                  />
                ))}
              </div>

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

        {/* Detail panel */}
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
  );
}

// ── Detail Panel ─────────────────────────────────────────────────────
function DetailPanel({ event, userTokens, isRegistered, onClose, onRegister }) {
  const cfg       = TYPE_CONFIG[event.eventType] || TYPE_CONFIG.Seminar;
  const fee       = event.registrationFee > 0 ? event.registrationFee : cfg.fee;
  const seatsLeft = event.totalSeats - event.seatsTaken;
  const isFull    = seatsLeft <= 0;
  const canAfford = userTokens >= fee;

  return (
    <div className="detail-panel">

      {/* Image or coloured banner */}
      <div className="dp-banner" style={{ background: `linear-gradient(135deg,${cfg.bg},#f0eeff)` }}>
        {event.eventImage
          ? <img src={event.eventImage} alt={event.eventName} className="dp-banner__img" />
          : <span className="dp-banner__emoji">{cfg.emoji}</span>
        }
        <button className="dp-close" onClick={onClose}>✕</button>
        <span className="dp-type-tag" style={{ color: cfg.color, background: "rgba(255,255,255,0.88)" }}>
          {event.eventType}
        </span>
      </div>

      <div className="dp-body">
        <div className="dp-dots">
          <span style={{ background: "#ff5f57" }} /><span style={{ background: "#febc2e" }} /><span style={{ background: "#28c840" }} />
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
            👥 {event.seatsTaken}/{event.totalSeats} &nbsp;·&nbsp;
            <b style={{ color: seatsLeft > 20 ? "#2d8a4e" : seatsLeft > 0 ? "#c07a00" : "#c0392b" }}>
              {isFull ? "FULL" : `${seatsLeft} left`}
            </b>
          </div>
        </div>

        <div className="dp-cost">
          <span>🪙 <b>{fee}</b> tokens</span>
          <span style={{ color: canAfford ? "#2d8a4e" : "#c0392b", fontWeight: 700 }}>
            Balance: {userTokens} 🪙
          </span>
        </div>

        {isRegistered
          ? <button className="dp-btn dp-btn--done" disabled>✅ Already Registered</button>
          : <button className="dp-btn dp-btn--primary"
              style={{ background: (!canAfford || isFull) ? "#ccc" : cfg.color }}
              disabled={!canAfford || isFull}
              onClick={onRegister}>
              {isFull ? "Event Full" : !canAfford ? "Insufficient Tokens" : "Fill Registration Form →"}
            </button>
        }
        <button className="dp-btn dp-btn--ghost" onClick={onClose}>← Close</button>
      </div>
    </div>
  );
}

export default UserHomePage;