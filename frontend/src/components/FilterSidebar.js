// frontend/src/components/FilterSidebar.js
import React from "react";
import "./FilterSidebar.css";

const EVENT_TYPES  = ["Hackathon","Workshop","Seminar","Conference","Webinar"];
const VENUE_TYPES  = ["Online","Offline","Hybrid"];

function FilterSidebar({ selectedTypes, setSelectedTypes, selectedVenues, setSelectedVenues, orgSearch, setOrgSearch, toggleFilter }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__head">
        <span className="sidebar__title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filters
        </span>
        <span className="sidebar__menu">☰</span>
      </div>

      <div className="sidebar__section">
        <p className="sidebar__label">EVENT TYPE</p>
        {EVENT_TYPES.map(t => (
          <CB key={t} label={t} checked={selectedTypes.includes(t)}
            onChange={() => toggleFilter(t, selectedTypes, setSelectedTypes)} />
        ))}
      </div>

      <div className="sidebar__section">
        <p className="sidebar__label">VENUE</p>
        {VENUE_TYPES.map(v => (
          <CB key={v} label={v} checked={selectedVenues.includes(v)}
            onChange={() => toggleFilter(v, selectedVenues, setSelectedVenues)} />
        ))}
      </div>

      <div className="sidebar__section">
        <p className="sidebar__label">ORGANISER</p>
        <input className="sidebar__search" placeholder="Search org..."
          value={orgSearch} onChange={e => setOrgSearch(e.target.value)} />
      </div>
    </aside>
  );
}

function CB({ label, checked, onChange }) {
  return (
    <label className="cb">
      <div className={`cb__box ${checked ? "cb__box--on" : ""}`} onClick={onChange}>
        {checked && <span className="cb__tick">✓</span>}
      </div>
      <span className="cb__lbl">{label}</span>
    </label>
  );
}

export default FilterSidebar;