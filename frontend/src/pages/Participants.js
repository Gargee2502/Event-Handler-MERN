// frontend/src/pages/Participants.js
import React, { useState } from 'react';
import AdminNavbar from '../components/Admin/AdminNavbar';
import Sidebar from '../components/Admin/Sidebar';
import StatCard from '../components/Admin/StatCard';
import { Download, Mail } from 'lucide-react';

const Participants = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Mock data based on the wireframe
  const participantList = [
    { name: "Aarav S.", email: "aarav@email.com", id: "001" },
    { name: "Priya M.", email: "priya@email.com", id: "002" },
    { name: "Rohan K.", email: "rohan@email.com", id: "003" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ef' }}>
      <AdminNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main style={{ flex: 1, padding: '24px', transition: 'all 0.3s ease' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '4px' }}>Participants List</h2>
          <p style={{ fontSize: '0.8rem', color: '#7a7a8c', marginBottom: '24px' }}>HackForge 2025 · 120 registered</p>

          {/* Registration Stats */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <StatCard label="Registered" value="120" color="#ddd6f7" />
            <StatCard label="Attended" value="89" color="#c5e8d8" />
          </div>

          <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead style={{ background: '#ddd6f7', color: '#6b5ce7' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                </tr>
              </thead>
              <tbody>
                {participantList.map((user, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f0eefc' }}>
                    <td style={{ padding: '12px' }}><strong>{user.name}</strong></td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>{user.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Footer Actions */}
            <div style={{ padding: '16px', display: 'flex', gap: '10px', background: '#fafbff' }}>
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#6b5ce7', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Download size={14} /> Export CSV
              </button>
              <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #6b5ce7', background: 'white', color: '#6b5ce7', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Mail size={14} /> Notify All
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Participants;