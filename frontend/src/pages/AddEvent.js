import React, { useState } from 'react';
import AdminNavbar from '../components/Admin/AdminNavbar';
import Sidebar from '../components/Admin/Sidebar';
import { PlusCircle, Upload } from 'lucide-react';

const AddEvent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ef' }}>
      <AdminNavbar />
      <div style={{ display: 'flex' }}>
        {/* Sidebar now controls the layout here too */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main style={{ flex: 1, padding: '40px 20px', transition: 'all 0.3s ease' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 24px rgba(107,92,231,0.10)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '8px' }}>➕ Add New Event</h2>
            <p style={{ fontSize: '0.8rem', color: '#7a7a8c', marginBottom: '24px' }}>Fill in details to launch a new event.</p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c', display: 'block', marginBottom: '4px' }}>Event Name</label>
                <input type="text" placeholder="e.g. HackForge 2025" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}>Event Type</label>
                  <select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }}>
                    <option>Hackathon</option><option>Workshop</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}>Date</label>
                  <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}>Description</label>
                <textarea rows="4" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef', resize: 'none' }}></textarea>
              </div>

              <div style={{ border: '2px dashed #ddd6f7', borderRadius: '12px', padding: '20px', textAlign: 'center', background: '#fafbff' }}>
                <Upload size={20} style={{ color: '#7a7a8c' }} />
                <p style={{ fontSize: '0.7rem', color: '#7a7a8c' }}>Upload Event Poster</p>
              </div>

              <button type="button" style={{ padding: '14px', borderRadius: '10px', border: 'none', background: '#6b5ce7', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <PlusCircle size={18} /> Publish Event
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddEvent;