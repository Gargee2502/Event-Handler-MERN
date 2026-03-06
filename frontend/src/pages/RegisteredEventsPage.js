// frontend/src/pages/RegisteredEventsPage.js
import React, { useEffect, useState } from "react";
import { getUserEvents } from "../services/eventServices.js";
import EventCard from "../components/EventCard.js"; // Reuse card

function RegisteredEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "mockUser123";

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const res = await getUserEvents(userId);
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchUserEvents();
  }, []);

  if (loading) return <p>Loading your events...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Registered Events</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {events.map((event) => (
          <EventCard 
            key={event._id} 
            event={event} 
            onRegister={() => {}} // No register here
            userId={userId} 
          />
        ))}
      </div>
      {events.length === 0 && <p>You haven't registered for any events yet.</p>}
    </div>
  );
}

export default RegisteredEventsPage;