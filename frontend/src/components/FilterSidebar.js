// frontend/src/components/FilterSidebar.js
import React from "react";

function FilterSidebar({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFilters((prev) => {
      const newValues = checked
        ? [...(prev[name] || []), value]
        : (prev[name] || []).filter((v) => v !== value);
      return { ...prev, [name]: newValues };
    });
  };

  return (
    <div 
      style={{ 
        width: "200px", 
        padding: "20px", 
        backgroundColor: "#f0f0f0", 
        borderRight: "1px solid #ccc", 
        height: "100vh", 
        position: "fixed" 
      }}
    >
      <h3 style={{ color: "#333" }}>Filters</h3>
      <h4>Event Type</h4>
      <label>
        <input type="checkbox" name="eventType" value="Hackathon" onChange={handleChange} />
        Hackathon
      </label><br />
      <label>
        <input type="checkbox" name="eventType" value="Workshop" onChange={handleChange} />
        Workshop
      </label><br />
      <label>
        <input type="checkbox" name="eventType" value="Conference" onChange={handleChange} />
        Conference
      </label><br />
      <label>
        <input type="checkbox" name="eventType" value="Webinar" onChange={handleChange} />
        Webinar
      </label><br />
      {/* Add more filters like Date, Venue */}
      <h4>Venue</h4>
      <label>
        <input type="checkbox" name="venue" value="Online" onChange={handleChange} />
        Online
      </label><br />
      <label>
        <input type="checkbox" name="venue" value="Offline" onChange={handleChange} />
        Offline
      </label><br />
      <label>
        <input type="checkbox" name="venue" value="Hybrid" onChange={handleChange} />
        Hybrid
      </label><br />
    </div>
  );
}

export default FilterSidebar;