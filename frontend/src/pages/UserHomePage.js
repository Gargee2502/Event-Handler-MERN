// frontend/src/pages/UserHomePage.js
import React, { useEffect, useState } from "react";
import { getAllEvents, registerForEvent } from "../services/eventServices.js";
import EventCard from "../components/EventCard.js";
import FilterSidebar from "../components/FilterSidebar.js";

function UserHomePage() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ eventType: [], venue: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5; // Show 5 per page
  const userId = "mockUser123"; // Replace with real user ID later

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    await registerForEvent(eventId, userId);
    fetchEvents(); // Refetch to update counts
  };

  const filteredEvents = events.filter((event) => {
    const typeMatch = filters.eventType.length === 0 || filters.eventType.includes(event.eventType);
    const venueMatch = filters.venue.length === 0 || filters.venue.includes(event.venue);
    return typeMatch && venueMatch;
  });

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading events...</p>;

  return (
    <div style={{ display: "flex" }}>
      <FilterSidebar filters={filters} setFilters={setFilters} />
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h2 style={{ color: "#333" }}>Discover Events</h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {currentEvents.map((event) => (
            <EventCard 
              key={event._id} 
              event={event} 
              onRegister={handleRegister} 
              userId={userId} 
            />
          ))}
        </div>
        {/* Pagination */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page} 
              onClick={() => setCurrentPage(page)} 
              style={{ 
                margin: "5px", 
                padding: "10px", 
                backgroundColor: currentPage === page ? "#4CAF50" : "#ddd", 
                color: "white", 
                border: "none", 
                cursor: "pointer" 
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserHomePage;