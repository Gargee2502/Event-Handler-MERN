// frontend/src/pages/RegistrationPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getEventById, registerForEvent } from "../services/eventServices.js";
import "./RegistrationPage.css";

const TYPE_CONFIG = {
  Hackathon:  { color: "#7c6fcd", bg: "#ede9ff", emoji: "🚀", fee: 250 },
  Workshop:   { color: "#2d8a4e", bg: "#d4f5e2", emoji: "🤖", fee: 150 },
  Webinar:    { color: "#c07a00", bg: "#fff0cc", emoji: "💡", fee: 50  },
  Conference: { color: "#1a6fa8", bg: "#cce8ff", emoji: "☁️", fee: 300 },
  Seminar:    { color: "#c0392b", bg: "#ffe8e8", emoji: "📚", fee: 100 },
};

const COMMON_FIELDS = [
  { name: "fullName",  label: "Full Name",           type: "text",   placeholder: "e.g. Gargee Rai",  required: true },
  { name: "email",     label: "Email ID",             type: "email",  placeholder: "you@college.edu",  required: true },
  { name: "studentId", label: "Student ID",           type: "text",   placeholder: "e.g. 22CS101",     required: true },
  { name: "college",   label: "College / University", type: "text",   placeholder: "e.g. IIT Delhi",   required: true },
  { name: "course",    label: "Course",               type: "select",
    options: ["B.Tech","B.Sc","BCA","MCA","M.Tech","MBA","BBA","B.Com","Other"],
    required: true },
  { name: "year",      label: "Year of Study",        type: "select",
    options: ["1st Year","2nd Year","3rd Year","4th Year","Postgraduate"],
    required: true },
];

const EXTRA_FIELDS = {
  Hackathon: [
    { name: "teamName", label: "Team Name", type: "text",   placeholder: "Leave blank if solo", required: false },
    { name: "teamSize", label: "Team Size", type: "select", options: ["1 (Solo)","2","3","4"],  required: true  },
  ],
  Conference: [
    { name: "teamName", label: "Group / Delegation Name", type: "text",   placeholder: "Optional", required: false },
    { name: "teamSize", label: "Group Size",              type: "select", options: ["1","2","3","4","5+"], required: false },
  ],
};

function RegistrationPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();   // ✅ get fee passed from detail page

  const [event,      setEvent]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [step,       setStep]       = useState(1);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ✅ FIX: read userTokens fresh from localStorage every render
  const userTokens = Number(localStorage.getItem("userTokens") ?? 1000);

  const [form, setForm] = useState({
    fullName: "", email: "", studentId: "",
    college: "", course: "", year: "",
    teamName: "", teamSize: "",
  });

  useEffect(() => {
    getEventById(id)
      .then(res => setEvent(res.data))
      .catch(err => { console.error(err); setLoading(false); })
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ FIX: fee from navigation state OR DB OR TYPE_CONFIG fallback
  const getFee = () => {
    if (location.state?.fee && location.state.fee > 0) return location.state.fee;
    if (event?.registrationFee && event.registrationFee > 0) return event.registrationFee;
    return TYPE_CONFIG[event?.eventType]?.fee ?? 250;
  };

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    const extra = EXTRA_FIELDS[event?.eventType] || [];
    [...COMMON_FIELDS, ...extra].forEach(f => {
      if (f.required && !form[f.name]?.trim()) errs[f.name] = "This field is required";
    });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email address";
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(2);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    const fee = getFee();

    try {
      // ✅ FIX: send to backend — saves to DB and increments seatsTaken
      await registerForEvent(id, { ...form, userId: form.studentId });

      // ✅ FIX: deduct tokens in localStorage (shown on home page navbar)
      const newTokens = userTokens - fee;
      localStorage.setItem("userTokens", String(newTokens));

      // ✅ mark this event as registered
      const ids = new Set(JSON.parse(localStorage.getItem("registeredIds") ?? "[]"));
      ids.add(id);
      localStorage.setItem("registeredIds", JSON.stringify([...ids]));

      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── loading ──────────────────────────────────────────────────────
  if (loading) return (
    <div className="reg-layout">
      <div className="reg-card">
        {[1,2,3,4].map(i => (
          <div key={i} className="reg-skeleton" style={{ width: `${90 - i * 10}%`, margin: "14px 24px" }} />
        ))}
      </div>
    </div>
  );

  if (!event) return (
    <div className="reg-layout">
      <div className="reg-card" style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "#aaa" }}>Event not found.</p>
        <button className="btn btn--ghost" onClick={() => navigate("/")}>← Back</button>
      </div>
    </div>
  );

  const cfg         = TYPE_CONFIG[event.eventType] || TYPE_CONFIG.Seminar;
  const fee         = getFee();
  const remaining   = userTokens - fee;
  const extraFields = EXTRA_FIELDS[event.eventType] || [];

  return (
    <div className="reg-layout">
      <div className="reg-card">

        {/* Header */}
        <div className="reg-header">
          <div className="reg-header__left">
            <button className="back-btn"
              onClick={() => step === 1 ? navigate(`/event/${id}`) : setStep(1)}>
              ← Back
            </button>
            <div>
              <div className="reg-header__name">{event.eventName}</div>
              <span className="reg-header__type"
                style={{ color: cfg.color, background: cfg.bg }}>
                {event.eventType}
              </span>
            </div>
          </div>
          <div className="token-badge">
            <span>🪙</span>
            <span className="token-badge__count">{userTokens}</span>
            <span className="token-badge__label">tokens</span>
          </div>
        </div>

        {/* Step bar */}
        <div className="reg-steps">
          {["Your Details", "Confirm & Pay"].map((lbl, i) => (
            <React.Fragment key={lbl}>
              <div className={`step-dot
                ${step === i + 1 ? "step-dot--active" : ""}
                ${step > i + 1  ? "step-dot--done"   : ""}`}>
                {step > i + 1 ? "✓" : i + 1}
                <span className="step-dot__label">{lbl}</span>
              </div>
              {i < 1 && (
                <div className={`step-line ${step > i + 1 ? "step-line--done" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ══ STEP 1: FORM ══ */}
        {step === 1 && (
          <div className="reg-body">
            <h2 className="reg-title">Registration Form</h2>
            <p className="reg-sub">
              Fields marked <b style={{ color: "#c0392b" }}>*</b> are required
            </p>

            <div className="fields-section">
              <p className="fields-label">📋 Basic Information</p>
              <div className="fields-grid">
                {COMMON_FIELDS.map(f => (
                  <FormField key={f.name} field={f} value={form[f.name]}
                    onChange={handle} error={errors[f.name]} accentColor={cfg.color} />
                ))}
              </div>
            </div>

            {extraFields.length > 0 && (
              <div className="fields-section">
                <p className="fields-label" style={{ color: cfg.color }}>
                  {cfg.emoji} {event.eventType} Details
                </p>
                <div className="fields-grid">
                  {extraFields.map(f => (
                    <FormField key={f.name} field={f} value={form[f.name]}
                      onChange={handle} error={errors[f.name]} accentColor={cfg.color} />
                  ))}
                </div>
              </div>
            )}

            <button className="btn btn--primary"
              style={{ background: cfg.color }} onClick={handleNext}>
              Continue to Payment →
            </button>
          </div>
        )}

        {/* ══ STEP 2: PAYMENT ══ */}
        {step === 2 && (
          <div className="reg-body reg-body--center">
            <div className="pay-icon">🪙</div>
            <h2 className="reg-title">Confirm Payment</h2>
            <p className="reg-sub" style={{ marginBottom: 20 }}>
              Review before final confirmation
            </p>

            <div className="pay-box">
              <PayRow label="Your current tokens"              val={`${userTokens} 🪙`} />
              <PayRow label={`Fee — ${event.eventName}`}       val={`− ${fee} 🪙`} red />
              <div className="pay-divider" />
              <PayRow label="Remaining tokens after payment"   val={`${remaining} 🪙`} green bold />
            </div>

            <div className="pay-warn">
              <span>⚠️</span>
              <p>
                By clicking <b>Confirm & Register</b> you give permission to deduct&nbsp;
                <b>{fee} tokens</b>. This cannot be undone.
              </p>
            </div>

            <div className="pay-summary">
              <b>Name:</b> {form.fullName}<br />
              <b>Student ID:</b> {form.studentId}<br />
              <b>Email:</b> {form.email}<br />
              <b>College:</b> {form.college}<br />
              <b>Course:</b> {form.course} · {form.year}
              {form.teamName && <><br /><b>Team:</b> {form.teamName} ({form.teamSize})</>}
            </div>

            <div className="btn-row">
              <button className="btn btn--ghost" onClick={() => setStep(1)}>
                ← Edit Details
              </button>
              <button className="btn btn--confirm" onClick={handleConfirm}
                disabled={submitting}>
                {submitting ? "Registering..." : "✅ Confirm & Register"}
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 3: SUCCESS ══ */}
        {step === 3 && (
          <div className="reg-body reg-body--center">
            <div className="success-emoji">🎉</div>
            <h2 className="reg-title" style={{ color: "#2d8a4e" }}>
              You're Registered!
            </h2>
            <p className="reg-sub">See you at <b>{event.eventName}</b>!</p>

            <div className="success-token-box">
              <div className="success-token-row">
                <span>New token balance</span>
                <div className="token-badge">
                  <span>🪙</span>
                  <span className="token-badge__count">{remaining}</span>
                </div>
              </div>
              <div className="success-bar">
                <div className="success-bar__fill"
                  style={{
                    width: `${(remaining / 1000) * 100}%`,
                    background: `linear-gradient(90deg, ${cfg.color}, #a78bfa)`
                  }} />
              </div>
              <div className="success-bar__labels">
                <span>0</span><span>1000</span>
              </div>
            </div>

            <div className="success-info">
              <div>📅 {event.date} &nbsp;·&nbsp; 📍 {event.venue}</div>
              <div>🆔 Student ID: <b>{form.studentId}</b></div>
              <div>📧 <b>{form.email}</b></div>
            </div>

            <button className="btn btn--primary"
              style={{ background: cfg.color }}
              onClick={() => navigate("/")}>
              ← Back to Events
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────────
function FormField({ field, value, onChange, error, accentColor }) {
  const isWide = field.name === "college";
  return (
    <div className={`ff ${isWide ? "ff--full" : ""}`}>
      <label className="ff__label" style={{ color: accentColor }}>
        {field.label}
        {field.required && <span style={{ color: "#c0392b" }}> *</span>}
      </label>
      {field.type === "select" ? (
        <select name={field.name} value={value} onChange={onChange}
          className={`ff__input ${error ? "ff__input--err" : ""}`}>
          <option value="">Select...</option>
          {field.options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input name={field.name} type={field.type} value={value}
          onChange={onChange} placeholder={field.placeholder}
          className={`ff__input ${error ? "ff__input--err" : ""}`} />
      )}
      {error && <span className="ff__error">{error}</span>}
    </div>
  );
}

function PayRow({ label, val, red, green, bold }) {
  return (
    <div className="pay-row">
      <span>{label}</span>
      <span style={{
        fontWeight: bold ? 900 : 700,
        color: red ? "#c0392b" : green ? "#2d8a4e" : "#1a1040"
      }}>{val}</span>
    </div>
  );
}

export default RegistrationPage;