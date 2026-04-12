// frontend/src/pages/UserHomePage.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllEvents } from "../services/eventServices.js";
import FilterSidebar from "../components/FilterSidebar.js";
import EventCard from "../components/EventCard.js";
import API from "../services/api";
import "./UserHomePage.css";

// ── Configuration & Constants ───────────────────────────────────────────────

const ITEMS_PER_PAGE = 6;

const TYPE_CONFIG = {
  Hackathon: { color: "#7c6fcd", bg: "#ede9ff", emoji: "🚀", fee: 250 },
  Workshop: { color: "#2d8a4e", bg: "#d4f5e2", emoji: "🤖", fee: 150 },
  Webinar: { color: "#c07a00", bg: "#fff0cc", emoji: "💡", fee: 50 },
  Conference: { color: "#1a6fa8", bg: "#cce8ff", emoji: "☁️", fee: 300 },
  Seminar: { color: "#c0392b", bg: "#ffe8e8", emoji: "📚", fee: 100 },
};

const MIN_W = 260;
const MAX_W = 680;
const DEFAULT_W = 360;

// ── User Details Panel (Now rendered directly in the drawer) ───────────────

function UserDetailsPanel({ onClose, user, setUser }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const emailChanged = email !== user?.email;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setNotification(null);
    if (!email || !email.includes('@')) {
      return setNotification({ text: "Enter a valid email", type: "error" });
    }
    setSendingOtp(true);
    try {
      const token = localStorage.getItem("token");
      await API.post("/auth/send-update-otp", { newEmail: email }, { headers: { Authorization: `Bearer ${token}` } });
      setOtpSent(true);
      setNotification({ text: `OTP sent to ${email}`, type: "success" });
    } catch (err) {
      setNotification({ text: err.response?.data?.message || "Failed to send OTP", type: "error" });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSave = async () => {
    setNotification(null);
    if (password || confirm) {
      if (password !== confirm) return setNotification({ text: "Passwords do not match!", type: "error" });
      if (password.length < 6) return setNotification({ text: "Password must be at least 6 characters long.", type: "error" });
    }
    if (emailChanged && !otpSent) return setNotification({ text: "Please click 'Send OTP' to verify your new email first.", type: "error" });
    if (emailChanged && !otp) return setNotification({ text: "Please enter the OTP sent to your new email.", type: "error" });

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.put("/auth/update", {
        name, email, password: password || undefined, otp: emailChanged ? otp : undefined
      }, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setPassword(""); setConfirm(""); setOtp(""); setOtpSent(false);
    } catch (err) {
      setNotification({ text: err.response?.data?.message || "Failed to update profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: "100%", padding: "11px 14px", background: "#f7f4ff", border: "1.5px solid #ece8fc", borderRadius: 10, fontSize: "0.88rem", fontFamily: "'Nunito', sans-serif", outline: "none", color: "#2d2d2d", boxSizing: "border-box" };
  const lbl = { fontSize: "0.7rem", color: "#7a7a8c", fontWeight: 600, marginBottom: 5, display: "block", letterSpacing: "0.05em", textTransform: "uppercase" };

  return (
    <div style={{ paddingBottom: 10 }}>
      {notification && (
        <div style={{ marginBottom: 16, padding: "10px 14px", background: notification.type === "success" ? "rgba(44,191,138,0.1)" : "rgba(244,132,106,0.1)", border: `1px solid ${notification.type === "success" ? "rgba(44,191,138,0.3)" : "rgba(244,132,106,0.3)"}`, borderRadius: "10px", color: notification.type === "success" ? "#1a7a52" : "#d63031", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} style={{ background: "transparent", border: "none", color: notification.type === "success" ? "#1a7a52" : "#d63031", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1, padding: 0 }}>&times;</button>
        </div>
      )}
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>User Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} style={inp} placeholder="Your full name" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Email ID</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setOtpSent(false); setOtp(""); setNotification(null); }} style={inp} placeholder="your@email.com" />
          {emailChanged && !otpSent && (
            <button onClick={handleSendOtp} disabled={sendingOtp} style={{ padding: "0 16px", background: "#e0f5ed", color: "#1a7a52", border: "none", borderRadius: 10, fontSize: "0.75rem", fontWeight: 700, cursor: sendingOtp ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>{sendingOtp ? "Sending..." : "Send OTP"}</button>
          )}
        </div>
        {emailChanged && otpSent && (
          <div style={{ marginTop: "8px" }}>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value)} style={{ ...inp, borderColor: "#2cbf8a", background: "#f0fff8" }} placeholder="Enter 6-digit OTP sent to new email" />
          </div>
        )}
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Change Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inp} placeholder="New password" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Confirm Password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} style={inp} placeholder="Confirm new password" />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button onClick={handleSave} disabled={loading} style={{ flex: 2, padding: 12, background: saved ? "#2cbf8a" : "#5b4fcf", color: "white", border: "none", borderRadius: 11, fontSize: "0.9rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Nunito', sans-serif", transition: "background 0.2s", opacity: loading ? 0.7 : 1 }}>{loading ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}</button>
        <button onClick={onClose} style={{ flex: 1, padding: 12, background: "white", color: "#7a7a8c", border: "1.5px solid #ece8fc", borderRadius: 11, fontSize: "0.9rem", fontWeight: 600, fontFamily: "'Nunito', sans-serif", cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Main Dashboard Component ────────────────────────────────────────────────

function UserHomePage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [orgSearch, setOrgSearch] = useState("");

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const [userTokens, setUserTokens] = useState(() => Number(localStorage.getItem("userTokens") ?? 10000));
  const [registeredIds, setRegisteredIds] = useState(() => new Set(JSON.parse(localStorage.getItem("registeredIds") ?? "[]")));

  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "guest@email.com";

  // ── ACCOUNT SWITCH DETECTOR (Prevents state leakage) ──
  useEffect(() => {
    const activeUserEmail = localStorage.getItem("activeUserEmail");
    // If we have a user, and their email doesn't match the last recorded email
    if (user?.email && activeUserEmail !== user.email) {
      // Wipe the prototype data and reset for the new user!
      localStorage.setItem("activeUserEmail", user.email);
      localStorage.setItem("userTokens", "10000");
      localStorage.setItem("registeredIds", "[]");
      setUserTokens(10000);
      setRegisteredIds(new Set());
    }
  }, [user]);

  const generateInitials = (nameStr) => {
    if (!nameStr) return "GU";
    const parts = nameStr.trim().split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameStr.slice(0, 2).toUpperCase();
  };
  const initials = generateInitials(userName);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_W);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startW = useRef(DEFAULT_W);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const onDragStart = useCallback((e) => {
    e.preventDefault();
    startX.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    startW.current = drawerWidth;
    setIsDragging(true);
  }, [drawerWidth]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const cx = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const next = Math.min(MAX_W, Math.max(MIN_W, startW.current + (startX.current - cx)));
      setDrawerWidth(next);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const sync = () => {
      setUserTokens(Number(localStorage.getItem("userTokens") ?? 10000));
      setRegisteredIds(new Set(JSON.parse(localStorage.getItem("registeredIds") ?? "[]")));
    };
    window.addEventListener("focus", sync);
    sync();
    return () => window.removeEventListener("focus", sync);
  }, []);

  const dummyDiscoverEvents = [
    {
      _id: "69ab339584e9323c19f126e6",
      eventName: "AI/ML Workshop",
      eventType: "Workshop",
      eventDescription: "Hands-on session on building ML models with real datasets.",
      eventImage: "",
      date: "Apr 2, 2025",
      time: "10:00 AM - 4:00 PM",
      venue: "Online (Zoom)",
      speaker: "Priya Mehta, Anthropic",
      organisedBy: "AI Society",
      totalSeats: 150,
      seatsTaken: 70,
      registrationFee: 0,
      emoji: "💡"
    }
  ];

  useEffect(() => {
    getAllEvents()
      .then(res => {
        if (res.data && res.data.length > 0) setEvents(res.data);
        else setEvents(dummyDiscoverEvents);
      })
      .catch(err => {
        console.error("API failed, loading dummy data...", err);
        setEvents(dummyDiscoverEvents);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFilter = (val, arr, setter) => {
    const s = new Set(arr);
    s.has(val) ? s.delete(val) : s.add(val);
    setter([...s]);
    setCurrentPage(1);
  };

  const unregisteredEvents = events.filter(e => !registeredIds.has(e._id));
  const registeredEvents = events.filter(e => registeredIds.has(e._id));

  const applyFilters = (list) => list.filter(e => {
    const tOk = selectedTypes.length === 0 || selectedTypes.includes(e.eventType);
    const vOk = selectedVenues.length === 0 || selectedVenues.includes(
      e.venue?.toLowerCase().includes("online") ? "Online" : e.venue?.toLowerCase().includes("hybrid") ? "Hybrid" : "Offline"
    );
    const oOk = !orgSearch || e.organisedBy?.toLowerCase().includes(orgSearch.toLowerCase());
    return tOk && vOk && oOk;
  });

  const displayList = activeTab === "discover" ? applyFilters(unregisteredEvents) : registeredEvents;
  const totalPages = Math.max(1, Math.ceil(displayList.length / ITEMS_PER_PAGE));
  const paginated = displayList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const activeTags = [...selectedTypes, ...selectedVenues];

  const switchTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedEvent(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeUserEmail");
    localStorage.removeItem("userTokens");
    localStorage.removeItem("registeredIds");
    window.location.href = "/login";
  };

  return (
    <div className="home-root">
      {isDragging && <div style={{ position: "fixed", inset: 0, zIndex: 9999, cursor: "ew-resize" }} />}

      {/* ── Top Navbar ── */}
      <nav className="top-nav">
        <div className="top-nav__brand">
          <span className="top-nav__dot" />
          <span className="top-nav__logo">Event Handler</span>
        </div>
        <div className="top-nav__center">
          <button className={`top-nav__tab ${activeTab === "discover" ? "top-nav__tab--active" : ""}`} onClick={() => switchTab("discover")}>
            🔍 Discover Events
            <span className="nav-badge">{unregisteredEvents.length}</span>
          </button>
          <button className={`top-nav__tab ${activeTab === "registered" ? "top-nav__tab--active top-nav__tab--green" : ""}`} onClick={() => switchTab("registered")}>
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

          {/* ── Dynamic Avatar Button ── */}
          <div className="nav-avatar" onClick={openDrawer} style={{ background: "linear-gradient(135deg, #5b4fcf, #9b8ef5)", transition: "transform 0.15s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            {initials}
          </div>
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
        {activeTab === "discover" && (
          <FilterSidebar selectedTypes={selectedTypes} setSelectedTypes={t => { setSelectedTypes(t); setCurrentPage(1); }} selectedVenues={selectedVenues} setSelectedVenues={v => { setSelectedVenues(v); setCurrentPage(1); }} orgSearch={orgSearch} setOrgSearch={v => { setOrgSearch(v); setCurrentPage(1); }} toggleFilter={toggleFilter} />
        )}

        <div className={`home-content ${activeTab === "registered" ? "home-content--full" : ""}`}>
          {loading ? (
            <div className="event-grid">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <>
              <p className="result-count">
                {activeTab === "discover" ? <><b>{displayList.length}</b> events available</> : <><b>{displayList.length}</b> event{displayList.length !== 1 ? "s" : ""} registered</>}
              </p>

              {paginated.length === 0 && activeTab === "discover" && <div className="empty-state">No events match your filters 😕</div>}
              {paginated.length === 0 && activeTab === "registered" && (
                <div className="empty-state">
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🎟️</div>
                  <p>You haven't registered for any events yet.</p>
                  <button className="browse-btn" onClick={() => switchTab("discover")}>Browse Events →</button>
                </div>
              )}

              <div className="event-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
                {paginated.map((ev, i) => (
                  <EventCard key={ev._id} event={ev} style={{ animationDelay: `${i * 0.06}s` }} isRegistered={activeTab === "registered"} isSelected={selectedEvent?._id === ev._id} onOpen={() => setSelectedEvent(selectedEvent?._id === ev._id ? null : ev)} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`page-btn ${currentPage === p ? "page-btn--active" : ""}`} onClick={() => setCurrentPage(p)}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {selectedEvent && (
          <DetailPanel event={selectedEvent} userTokens={userTokens} isRegistered={registeredIds.has(selectedEvent._id)} onClose={() => setSelectedEvent(null)} onRegister={() => navigate(`/event/${selectedEvent._id}/register`)} />
        )}
      </div>

      {/* ── Profile Slider Drawer ── */}
      <div onClick={closeDrawer} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(30,20,60,0.28)", opacity: drawerOpen ? 1 : 0, pointerEvents: drawerOpen ? "all" : "none", transition: "opacity 0.3s", backdropFilter: drawerOpen ? "blur(2px)" : "none" }} />

      <div style={{ position: "fixed", top: 0, right: 0, width: `min(${drawerWidth}px, 92vw)`, height: "100vh", background: "white", zIndex: 250, transform: drawerOpen ? "translateX(0)" : "translateX(100%)", transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(91,79,207,.2)", userSelect: isDragging ? "none" : "auto" }}>

        {/* Resize Handle */}
        <div onMouseDown={onDragStart} onTouchStart={onDragStart} style={{ position: "absolute", top: 0, left: -6, width: 12, height: "100%", cursor: "col-resize", zIndex: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 4, height: 40, borderRadius: 4, background: isDragging ? "#5b4fcf" : "rgba(91,79,207,0.3)", transition: "background 0.2s" }} />
        </div>

        <div style={{ height: 5, background: "linear-gradient(90deg, #5b4fcf, #f4c5c5, #bfe3f5)", flexShrink: 0 }} />

        {/* Drawer Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #ece8fc", flexShrink: 0, background: "linear-gradient(145deg, #f4f0ff, #fff0f8)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #5b4fcf, #9b8ef5)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "0.88rem", flexShrink: 0 }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#1a1040" }}>{userName}</div>
              <div style={{ fontSize: "0.7rem", color: "#7a7a8c" }}>{userEmail}</div>
            </div>
          </div>
          <button onClick={closeDrawer} style={{ background: "none", border: "none", cursor: "pointer", color: "#7a7a8c", fontSize: "1.2rem" }}>✕</button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px 0", fontFamily: "'Nunito', sans-serif" }}>

          <UserDetailsPanel onClose={closeDrawer} user={user} setUser={setUser} />

          <div style={{ height: 1, background: "#f0eefc", margin: "8px 0 14px" }} />

          <button onClick={handleLogout} style={{ width: "100%", padding: 13, background: "#fff5f5", color: "#e8615a", border: "1.5px solid #fdd", borderRadius: 12, fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Nunito', sans-serif", cursor: "pointer", marginBottom: 28 }}>
            🚪 Logout
          </button>

        </div>
      </div>
    </div>
  );
}

// ── Detail Panel ─────────────────────────────────────────────────────
function DetailPanel({ event, userTokens, isRegistered, onClose, onRegister }) {
  const cfg = TYPE_CONFIG[event.eventType] || TYPE_CONFIG.Seminar;
  const fee = event.registrationFee > 0 ? event.registrationFee : cfg.fee;
  const seatsLeft = event.totalSeats - event.seatsTaken;
  const isFull = seatsLeft <= 0;
  const canAfford = userTokens >= fee;

  return (
    <div className="detail-panel">
      <div className="dp-banner" style={{ background: `linear-gradient(135deg,${cfg.bg},#f0eeff)` }}>
        {event.eventImage ? <img src={event.eventImage} alt={event.eventName} className="dp-banner__img" /> : <span className="dp-banner__emoji">{event.emoji || cfg.emoji}</span>}
        <button className="dp-close" onClick={onClose}>✕</button>
        <span className="dp-type-tag" style={{ color: cfg.color, background: "rgba(255,255,255,0.88)" }}>{event.eventType}</span>
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
          <span style={{ color: canAfford ? "#2d8a4e" : "#c0392b", fontWeight: 700 }}>Balance: {userTokens} 🪙</span>
        </div>
        {isRegistered ? <button className="dp-btn dp-btn--done" disabled>✅ Already Registered</button> : <button className="dp-btn dp-btn--primary" style={{ background: (!canAfford || isFull) ? "#ccc" : cfg.color }} disabled={!canAfford || isFull} onClick={onRegister}>{isFull ? "Event Full" : !canAfford ? "Insufficient Tokens" : "Fill Registration Form →"}</button>}
        <button className="dp-btn dp-btn--ghost" onClick={onClose}>← Close</button>
      </div>
    </div>
  );
}

export default UserHomePage;