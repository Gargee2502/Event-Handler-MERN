import { useState } from "react";
import API from '../../services/api'; // 🎯 Two levels up to reach src
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 

    const navigate = useNavigate();

    const login = async () => {
        setLoading(true);
        setError(null); 
        try {
            // 🎯 Authenticate with the backend
            const res = await API.post("/auth/login", { email, password });

            // 1. Save the token and full user object (including role)
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // 2. 🎯 THE REDIRECT: Splits traffic between Admin and Student portals
            if (res.data.user.role === "admin") {
                navigate("/admin"); // Opens the AdminHome component
            } else {
                navigate("/profile"); // Regular students go to their profile
            }
            
        } catch (err) {
            // Updated error handling to prioritize specific backend messages
            setError(err.response?.data?.message || "Invalid credentials or unverified account.");
        } finally {
            setLoading(false);
        }
    };

    // --- STYLING (DM Sans & Soft Palette) ---
    const inputStyle = {
        width: "100%", padding: "11px 14px",
        background: "#f7f3ef", border: "1.2px solid #e8e4f8",
        borderRadius: "10px", fontSize: "0.88rem",
        fontFamily: "'DM Sans', sans-serif", outline: "none",
        color: "#2d2d2d", boxSizing: "border-box"
    };

    const labelStyle = {
        fontSize: "0.72rem", color: "#7a7a8c",
        fontWeight: 600, marginBottom: "5px", display: "block",
        letterSpacing: "0.05em", textTransform: "uppercase"
    };

    return (
        <div style={{
            height: "100vh", width: "100vw", overflow: "hidden",
            background: "#f0ecff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif",
        }}>

            {/* Background Decorative Elements */}
            <div style={{ position: "fixed", width: 340, height: 340, borderRadius: "50%", background: "rgba(107,92,231,0.08)", top: -80, right: -60, pointerEvents: "none" }} />
            <div style={{ position: "fixed", width: 260, height: 260, borderRadius: "50%", background: "rgba(244,132,106,0.06)", bottom: -70, left: -50, pointerEvents: "none" }} />

            <div style={{
                width: "100%", maxWidth: "400px",
                background: "white", borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(107,92,231,0.14)",
                border: "1.5px solid rgba(107,92,231,0.10)",
                position: "relative",
            }}>

                {/* Top Accent Bar */}
                <div style={{ height: 6, background: "linear-gradient(90deg, #f4846a, #f4c84a, #6b5ce7)" }} />

                <div style={{ padding: "32px 32px 40px" }}>

                    <div style={{ display: "flex", gap: 5, marginBottom: 24 }}>
                        {["#f4846a", "#f4c84a", "#64c87d"].map(c => (
                            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "block" }} />
                        ))}
                    </div>

                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>👋</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#2d2d2d", marginBottom: 4 }}>
                            Welcome Back
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#7a7a8c" }}>
                            Sign in to manage your events
                        </div>
                    </div>

                    {/* Notification UI */}
                    {error && (
                        <div style={{
                            marginBottom: 16,
                            padding: "10px 14px",
                            background: "rgba(244,132,106,0.1)",
                            border: "1px solid rgba(244,132,106,0.3)",
                            borderRadius: "10px",
                            color: "#d63031",
                            fontSize: "0.85rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <span>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                style={{
                                    background: "transparent", border: "none",
                                    color: "#d63031", cursor: "pointer",
                                    fontSize: "1.2rem", lineHeight: 1, padding: 0
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    )}

                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Email ID</label>
                        <input
                            type="email" placeholder="you@example.com"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password" placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ textAlign: "right", marginBottom: 22 }}>
                        <Link to="/reset-password" style={{ fontSize: "0.73rem", color: "#6b5ce7", fontWeight: 600, textDecoration: "none" }}>
                            Forgot password?
                        </Link>
                    </div>

                    <button onClick={login} disabled={loading} style={{
                        width: "100%", padding: "13px",
                        background: loading ? "#a89fe0" : "#6b5ce7",
                        color: "white", border: "none", borderRadius: 11,
                        fontSize: "0.92rem", fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        marginBottom: 20,
                    }}>
                        {loading ? "Signing in..." : "🔑 Login"}
                    </button>

                    <div style={{ height: 1, background: "#f0eefc", marginBottom: 20 }} />

                    <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#7a7a8c" }}>
                        Don't have an account?{" "}
                        <Link to="/signup" style={{ color: "#6b5ce7", fontWeight: 600, textDecoration: "none" }}>Sign up →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;