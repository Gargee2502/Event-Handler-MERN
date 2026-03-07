// frontend/src/components/FilterSidebar.js
import React from "react";
import "./FilterSidebar.css";

function FilterSidebar({ filters, setFilters }) {
  // ── YOUR ORIGINAL LOGIC (unchanged) ──────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFilters((prev) => {
      const newValues = checked
        ? [...(prev[name] || []), value]
        : (prev[name] || []).filter((v) => v !== value);
      return { ...prev, [name]: newValues };
    });
  };
  // ─────────────────────────────────────────────────────────────────────────

  const eventTypes = ["Hackathon", "Workshop", "Seminar", "Conference", "Webinar"];
  const venues     = ["Online", "Offline", "Hybrid"];

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Filters
        </span>
        <span className="sidebar__menu">☰</span>
      </div>

      <div className="sidebar__section">
        <p className="sidebar__label">EVENT TYPE</p>
        {eventTypes.map((type) => (
          <CustomCheckbox
            key={type}
            label={type}
            name="eventType"
            value={type}
            checked={(filters.eventType || []).includes(type)}
            onChange={handleChange}
          />
        ))}
      </div>

      <div className="sidebar__section">
        <p className="sidebar__label">VENUE</p>
        {venues.map((v) => (
          <CustomCheckbox
            key={v}
            label={v}
            name="venue"
            value={v}
            checked={(filters.venue || []).includes(v)}
            onChange={handleChange}
          />
        ))}
      </div>

      <div className="sidebar__section">
        <p className="sidebar__label">ORGANISER</p>
        <input
          type="text"
          placeholder="Search org..."
          className="sidebar__search"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, organiser: e.target.value }))
          }
        />
      </div>
    </aside>
  );
}

function CustomCheckbox({ label, name, value, checked, onChange }) {
  return (
    <label className="cb-wrap">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="cb-input"
      />
      <span className={`cb-box ${checked ? "cb-box--checked" : ""}`}>
        {checked && <span className="cb-tick">✓</span>}
      </span>
      <span className="cb-label">{label}</span>
    </label>
  );
}

export default FilterSidebar;