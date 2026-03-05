// frontend/src/pages/AdminHome.js
import React, { useState } from 'react';
import AdminNavbar from '../components/Admin/AdminNavbar';
import Sidebar from '../components/Admin/Sidebar';
import EventTable from '../components/Admin/EventTable'; // This will now render cards
import DeleteModal from '../components/Admin/DeleteModal';

const AdminHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ef' }}>
      <AdminNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main style={{ flex: 1, padding: '24px', transition: 'all 0.3s ease' }}>
          {/* Dashboard Overview and StatCards removed */}
          <h3 style={{ fontSize: '1.2rem', color: '#6b5ce7', marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>
            Manage Events
          </h3>
          
          <EventTable onDeleteClick={(name) => { setSelectedEvent(name); setIsModalOpen(true); }} />
        </main>
      </div>

      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        eventName={selectedEvent} 
      />
    </div>
  );
};

export default AdminHome;