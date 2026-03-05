// frontend/src/pages/EditEvent.js
import React, { useState } from 'react';
import AdminNavbar from '../components/Admin/AdminNavbar';
import Sidebar from '../components/Admin/Sidebar';
import { Save, Upload, X } from 'lucide-react';

const EditEvent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ef' }}>
      <AdminNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main style={{ flex: 1, padding: '30px', transition: 'all 0.3s ease' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '10px' }}>📝 Edit Event Details</h2>
            <p style={{ fontSize: '0.8rem', color: '#7a7a8c', marginBottom: '30px' }}>Update descriptions, posters, and seating availability.</p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                {/* Poster Section */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c', display: 'block', marginBottom: '8px' }}>Update Event Poster</label>
                  <div style={{ border: '2px dashed #ddd6f7', borderRadius: '12px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafbff', cursor: 'pointer' }}>
                    <Upload size={24} style={{ color: '#6b5ce7', marginBottom: '8px' }} />
                    <span style={{ fontSize: '0.7rem', color: '#7a7a8c' }}>Change Image</span>
                  </div>
                </div>

                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}>Event Name (Short)</label>
                    <input type="text" defaultValue="HackForge 2025" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}>Description (1-2 lines)</label>
                    <textarea defaultValue="An epic 48-hour hackathon to build world-changing solutions." rows="2" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef', resize: 'none' }} />
                  </div>
                </div>
              </div>

              {/* Seating Row */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}>Total Seats</label>
                  <input type="number" defaultValue="200" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}>Seats Taken</label>
                  <input type="number" defaultValue="120" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
                </div>
              </div>

              <button type="button" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#2cbf8a', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Save size={18} /> Update and Save Changes
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditEvent;