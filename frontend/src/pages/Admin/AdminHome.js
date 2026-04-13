import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import Sidebar from '../../components/Admin/Sidebar';
import EventTable from '../../components/Admin/EventTable';
import DeleteModal from '../../components/Admin/DeleteModal';
import API from '../../services/api'; //

const AdminHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);

  // 1. Filter State (Defaults to all types selected)
  const [selectedFilters, setSelectedFilters] = useState(['Hackathon', 'Workshop', 'Seminar']);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/events'); // Use protected API
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Filter logic to only show checked event types
  const filteredEvents = events.filter(event => 
    selectedFilters.includes(event.eventType)
  );

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await API.patch(`/events/${selectedEvent._id}/delete`); 
      setIsModalOpen(false);
      loadEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f7f3ef' }}>
        <p style={{ color: '#6b5ce7', fontWeight: 'bold' }}>Loading your events...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ef' }}>
      <AdminNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
        
        <main style={{ flex: 1, padding: '24px', transition: 'all 0.3s ease' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#6b5ce7', marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>
            Manage Events
          </h3>
          
          <EventTable 
            events={filteredEvents} 
            onDeleteClick={handleDeleteClick} 
          />
        </main>
      </div>

      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        eventName={selectedEvent?.eventName || ""} 
      />
    </div>
  );
};

export default AdminHome;