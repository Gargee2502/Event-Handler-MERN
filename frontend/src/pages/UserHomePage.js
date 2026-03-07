// frontend/src/pages/UserHomePage.js
import React, { useEffect, useState } from "react";
import { getAllEvents, registerForEvent } from "../services/eventServices.js";
import EventCard from "../components/EventCard.js";
import FilterSidebar from "../components/FilterSidebar.js";
import "./UserHomePage.css";

function UserHomePage() {
  // ── YOUR ORIGINAL LOGIC (unchanged) ──────────────────────────────────────
  const [events, setEvents]       = useState([]);
  const [filters, setFilters]     = useState({ eventType: [], venue: [] });
  const [loading, setLoading]     = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3; // 3 per page (matches design)
  const userId = "mockUser123";   // Replace with real user ID later

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    await registerForEvent(eventId, userId);
    fetchEvents();
  };

  const filteredEvents = events.filter((event) => {
    const typeMatch  = filters.eventType.length === 0 || filters.eventType.includes(event.eventType);
    const venueMatch = filters.venue.length === 0     || filters.venue.includes(event.venue);
    const orgMatch   = !filters.organiser             || event.organisedBy?.toLowerCase().includes(filters.organiser.toLowerCase());
    return typeMatch && venueMatch && orgMatch;
  });

  const indexOfLastEvent  = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents     = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages        = Math.ceil(filteredEvents.length / eventsPerPage);
  // ─────────────────────────────────────────────────────────────────────────

  // active filter tags (for display)
  const activeTags = [...(filters.eventType || []), ...(filters.venue || [])];

  if (loading) {
    return (
      <div className="home-layout">
        <div className="home-wrap">
          <HomeNavbar />
          <div className="home-skeleton">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton-row" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-layout">
      <div className="home-wrap">
        {/* ── Navbar ── */}
        <HomeNavbar />

        {/* ── Body ── */}
        <div className="home-body">
          <FilterSidebar filters={filters} setFilters={setFilters} />

          <div className="home-main">
            {/* count + tags */}
            <div className="home-meta">
              <span className="home-count">
                Showing <strong>{filteredEvents.length}</strong> events
                {activeTags.length > 0 && " · Filtered by:"}
              </span>
              <div className="home-tags">
                {activeTags.map((t) => (
                  <span key={t} className="home-tag">{t}</span>
                ))}
              </div>
            </div>

            {/* cards */}
            {currentEvents.length === 0 ? (
              <div className="home-empty">No events match your filters 😕</div>
            ) : (
              currentEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onRegister={handleRegister}
                  userId={userId}
                />
              ))
            )}

            {/* pagination */}
            {totalPages > 1 && (
              <div className="home-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? "page-btn--active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeNavbar() {
  return (
    <nav className="home-nav">
      <div className="home-nav__brand">
        <span className="home-nav__dot" />
        <span className="home-nav__logo">Event Handler</span>
      </div>
      <div className="home-nav__right">
        <span className="home-nav__label">Discover Events</span>
        <div className="home-nav__avatar">JD</div>
      </div>
    </nav>
  );
}

export default UserHomePage;