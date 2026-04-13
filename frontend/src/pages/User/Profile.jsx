import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../services/api'; // 🎯 Two levels up to reach src

// ── Sub-panels ───────────────────────────────────────────────────────────────

function UserDetailsPanel({ onClose, user, setUser }) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [college, setCollege] = useState(user?.college || "");
    const [year, setYear] = useState(user?.year || "");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    // Email Verification State
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
            // Using centralized API with automatic token attachment
            await API.post("/auth/send-update-otp", { newEmail: email });
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
            if (password.length < 6) return setNotification({ text: "Password must be 6+ characters.", type: "error" });
        }
        if (emailChanged && !otpSent) return setNotification({ text: "Verify your new email with OTP first.", type: "error" });

        setLoading(true);
        try {
            // 🎯 Includes the new profile fields: phone, college, year
            const res = await API.put("/auth/update", {
                name,
                email,
                phone,
                college,
                year,
                password: password || undefined,
                otp: emailChanged ? otp : undefined
            });

            localStorage.setItem("user", JSON.stringify(res.data.user));
            setUser(res.data.user);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            setPassword(""); setConfirm(""); setOtp(""); setOtpSent(false);

        } catch (err) {
            setNotification({ text: err.response?.data?.message || "Update failed", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const inp = { width: "100%", padding: "11px 14px", background: "#f7f4ff", border: "1.5px solid #ece8fc", borderRadius: 10, fontSize: "0.88rem", outline: "none", color: "#2d2d2d", boxSizing: "border-box", marginBottom: 12 };
    const lbl = { fontSize: "0.7rem", color: "#7a7a8c", fontWeight: 600, marginBottom: 5, display: "block", textTransform: "uppercase" };

    return (
        <div style={{ paddingBottom: 32 }}>
            {notification && (
                <div style={{ marginBottom: 16, padding: "10px 14px", background: notification.type === "success" ? "rgba(44,191,138,0.1)" : "rgba(244,132,106,0.1)", border: `1px solid ${notification.type === "success" ? "rgba(44,191,138,0.3)" : "rgba(244,132,106,0.3)"}`, borderRadius: "10px", color: notification.type === "success" ? "#1a7a52" : "#d63031", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{notification.text}</span>
                    <button onClick={() => setNotification(null)} style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontSize: "1.2rem" }}>&times;</button>
                </div>
            )}

            <label style={lbl}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={inp} />

            <label style={lbl}>Email ID</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: 12 }}>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setOtpSent(false); }} style={{ ...inp, marginBottom: 0 }} />
                {emailChanged && !otpSent && (
                    <button onClick={handleSendOtp} disabled={sendingOtp} style={{ padding: "0 16px", background: "#e0f5ed", color: "#1a7a52", border: "none", borderRadius: 10, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>{sendingOtp ? "..." : "Send OTP"}</button>
                )}
            </div>

            {emailChanged && otpSent && <input type="text" value={otp} onChange={e => setOtp(e.target.value)} style={{ ...inp, borderColor: "#2cbf8a" }} placeholder="Enter 6-digit OTP" />}

            {/* 🎓 NEW FIELDS */}
            <label style={lbl}>Phone Number</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={inp} />

            <label style={lbl}>College / Institution</label>
            <input type="text" value={college} onChange={e => setCollege(e.target.value)} style={inp} />

            <label style={lbl}>Year of Study</label>
            <input type="text" value={year} onChange={e => setYear(e.target.value)} style={inp} />

            <div style={{ height: 1, background: "#f0eefc", margin: "10px 0 20px" }} />

            <label style={lbl}>New Password (Optional)</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inp} />
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} style={inp} placeholder="Confirm new password" />

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button onClick={handleSave} disabled={loading} style={{ flex: 2, padding: 12, background: saved ? "#2cbf8a" : "#6b5ce7", color: "white", border: "none", borderRadius: 11, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer" }}>
                    {loading ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
                </button>
                <button onClick={onClose} style={{ flex: 1, padding: 12, background: "white", color: "#7a7a8c", border: "1.5px solid #ece8fc", borderRadius: 11, cursor: "pointer" }}>Cancel</button>
            </div>
        </div>
    );
}

function RegisteredEventsPanel() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🎯 Moved fallback outside or used useMemo to fix ESLint dependency warning
    const fallbackEvents = useMemo(() => [
        { _id: "1", emoji: "🚀", title: "HackForge 2025", date: "Mar 15, 2025", venue: "IIT Campus", type: "Upcoming", statusColor: "#6b5ce7", statusBg: "#f0ecff", grad: "linear-gradient(135deg,#ddd6f7,#bfe3f5)" },
        { _id: "2", emoji: "💡", title: "AI Workshop", date: "Apr 2, 2025", venue: "Online", type: "Confirmed", statusColor: "#2cbf8a", statusBg: "#e0f5ed", grad: "linear-gradient(135deg,#c5e8d8,#f0fff8)" },
    ], []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch user's actual registered events
                const res = await API.get("/events/registered");
                setEvents(res.data?.length ? res.data : fallbackEvents);
            } catch {
                setEvents(fallbackEvents);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [fallbackEvents]); // 🎯 Fixed dependency

    return (
        <div style={{ paddingBottom: 32 }}>
            {loading ? <div style={{ textAlign: "center", padding: "40px 0", color: "#7a7a8c" }}>Loading...</div> : 
            events.map(ev => (
                <div key={ev._id} style={{ marginBottom: 14, borderRadius: 16, overflow: "hidden", border: "1px solid #ece8fc", background: "white" }}>
                    <div style={{ height: 68, background: ev.grad || "linear-gradient(135deg,#ddd6f7,#bfe3f5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>{ev.emoji || "🎪"}</div>
                    <div style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2d2d2d" }}>{ev.title || ev.eventName}</div>
                            <span style={{ background: ev.statusBg || "#f0ecff", color: ev.statusColor || "#6b5ce7", borderRadius: 20, padding: "3px 11px", fontSize: "0.68rem", fontWeight: 700 }}>{ev.status || ev.eventType}</span>
                        </div>
                        <div style={{ fontSize: "0.73rem", color: "#7a7a8c" }}>📅 {ev.date || ev.eventDate} · 📍 {ev.venue || ev.eventVenue}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CertificatesPanel() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackCerts = useMemo(() => [
        { _id: "1", emoji: "🥇", eventName: "DevSprint 2024", type: "Participation Certificate", grad: "linear-gradient(135deg,#fdecd8,#fad5b0)" },
    ], []);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const res = await API.get("/certificates");
                setCerts(res.data?.length ? res.data : fallbackCerts);
            } catch {
                setCerts(fallbackCerts);
            } finally {
                setLoading(false);
            }
        };
        fetchCerts();
    }, [fallbackCerts]); // 🎯 Fixed dependency

    return (
        <div style={{ paddingBottom: 32 }}>
            {certs.map(cert => (
                <div key={cert._id} style={{ marginBottom: 14, borderRadius: 16, overflow: "hidden", border: "1px solid #ece8fc", background: "white" }}>
                    <div style={{ height: 68, background: cert.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>{cert.emoji}</div>
                    <div style={{ padding: "10px 14px" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{cert.eventName}</div>
                        <button style={{ background: "#fdecd8", color: "#b05a10", border: "none", borderRadius: 10, padding: "6px 16px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", marginTop: 8 }}>⬇ Download</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Main Profile Export ───────────────────────────────────────────────────────

const SECTIONS = [
    { key: "user-details", icon: "👤", label: "User Details" },
    { key: "registered-events", icon: "📅", label: "Registered Events" },
    { key: "certificates", icon: "🏆", label: "Certificates" },
];

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [drawerWidth, setDrawerWidth] = useState(360);
    const [isDragging, setIsDragging] = useState(false);

    const startX = useRef(0);
    const startW = useRef(360);

    const initials = useMemo(() => {
        const name = user?.name || "Guest";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const onDragStart = (e) => {
        startX.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
        startW.current = drawerWidth;
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e) => {
            const cx = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
            const next = Math.min(680, Math.max(260, startW.current + (startX.current - cx)));
            setDrawerWidth(next);
        };
        const onUp = () => setIsDragging(false);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    }, [isDragging]);

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f0ecff, #fff0f8)", fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ position: "fixed", top: 0, width: "100%", padding: "14px 20px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                <div style={{ color: "#6b5ce7", fontWeight: 700 }}>EventHandler</div>
                <button onClick={() => setDrawerOpen(true)} style={{ width: 40, height: 40, borderRadius: "50%", background: "#6b5ce7", color: "white", border: "none", cursor: "pointer", fontWeight: 700 }}>{initials}</button>
            </div>

            {/* Sidebar Drawer */}
            <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", opacity: drawerOpen ? 1 : 0, pointerEvents: drawerOpen ? "all" : "none", zIndex: 40, transition: "0.3s" }} />
            
            <div style={{ position: "fixed", top: 0, right: 0, width: `min(${drawerWidth}px, 92vw)`, height: "100vh", background: "white", zIndex: 50, transform: drawerOpen ? "translateX(0)" : "translateX(100%)", transition: isDragging ? "none" : "0.35s", boxShadow: "-8px 0 40px rgba(0,0,0,0.1)" }}>
                <div onMouseDown={onDragStart} style={{ position: "absolute", left: -6, width: 12, height: "100%", cursor: "ew-resize" }} />
                
                <div style={{ padding: 20, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
                    {activeSection ? <button onClick={() => setActiveSection(null)} style={{ border: "none", background: "none", color: "#6b5ce7", cursor: "pointer" }}>← Back</button> : <span>My Profile</span>}
                    <button onClick={() => setDrawerOpen(false)} style={{ border: "none", background: "none", cursor: "pointer" }}>✕</button>
                </div>

                <div style={{ padding: 20, overflowY: "auto", height: "calc(100% - 60px)" }}>
                    {!activeSection ? (
                        <>
                            {SECTIONS.map(sec => (
                                <button key={sec.key} onClick={() => setActiveSection(sec.key)} style={{ width: "100%", padding: 15, borderRadius: 12, background: "#f7f4ff", border: "1px solid #ece8fc", marginBottom: 10, cursor: "pointer", textAlign: "left" }}>
                                    {sec.icon} {sec.label}
                                </button>
                            ))}
                            <button onClick={handleLogout} style={{ width: "100%", padding: 13, background: "#fff5f5", color: "#e8615a", border: "1px solid #fdd", borderRadius: 12, cursor: "pointer", marginTop: 20 }}>Logout</button>
                        </>
                    ) : (
                        <>
                            {activeSection === "user-details" && <UserDetailsPanel onClose={() => setDrawerOpen(false)} user={user} setUser={setUser} />}
                            {activeSection === "registered-events" && <RegisteredEventsPanel />}
                            {activeSection === "certificates" && <CertificatesPanel />}
                        </>
                    )}
                </div>
            </div>

            <div style={{ padding: "100px 20px", textAlign: "center" }}>
                <h2 style={{ color: "#6b5ce7" }}>Welcome, {user.name?.split(" ")[0]}!</h2>
                <p style={{ color: "#7a7a8c" }}>Open your profile settings by clicking your initials in the top right.</p>
            </div>
        </div>
    );
}