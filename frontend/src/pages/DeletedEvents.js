import React, { useState } from 'react';
import AdminNavbar from '../components/Admin/AdminNavbar';
import Sidebar from '../components/Admin/Sidebar';
import { RefreshCw } from 'lucide-react';

const DeletedEvents = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const deletedData = [
    { name: "Old Workshop 2024", date: "Jan 10", reason: "Expired" },
    { name: "Cancelled Meetup", date: "Feb 15", reason: "Low budget" }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ef' }}>
      <AdminNavbar />
      <div style={{ display: 'flex' }}>
        {/* Toggle function fixed for this page */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main style={{ flex: 1, padding: '24px', transition: 'all 0.3s ease' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '8px' }}>🗑️ Deleted Events History</h2>
          <p style={{ fontSize: '0.75rem', color: '#7a7a8c', marginBottom: '20px' }}>Review and restore previously deleted events.</p>

          <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead style={{ background: '#f4c5c5', color: '#9c3030' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Event Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Deleted Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Reason</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedData.map((event, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f0eefc' }}>
                    <td style={{ padding: '12px' }}><strong>{event.name}</strong></td>
                    <td style={{ padding: '12px' }}>{event.date}</td>
                    <td style={{ padding: '12px' }}><span style={{ color: '#e8615a', fontWeight: '600' }}>{event.reason}</span></td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button style={{ background: '#c5e8d8', color: '#1a7a52', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <RefreshCw size={12} /> Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeletedEvents;