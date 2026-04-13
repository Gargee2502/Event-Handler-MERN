import React, { useState, useEffect } from 'react';
import API from '../../services/api'; //
import AdminNavbar from '../../components/Admin/AdminNavbar';
import Sidebar from '../../components/Admin/Sidebar';

const DeletedEvents = () => {
  const [deletedEvents, setDeletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeletedEvents();
  }, []);

  const loadDeletedEvents = async () => {
    try {
      // Fetches events where isDeleted is true
      const { data } = await API.get('/events/trash');
      setDeletedEvents(data);
    } catch (err) {
      console.error("Access Denied");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await API.patch(`/events/${id}/restore`);
      loadDeletedEvents();
    } catch (err) { alert("Failed to restore"); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ef' }}>
      <AdminNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar isOpen={true} />
        <main style={{ flex: 1, padding: '40px' }}>
          <h3 style={{ color: '#e8615a' }}>🗑️ Trash Bin</h3>
          {deletedEvents.map(event => (
            <div key={event._id} className="link-item">
              <span>{event.eventName}</span>
              <button onClick={() => handleRestore(event._id)} style={{ color: '#2cbf8a' }}>Restore</button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default DeletedEvents;