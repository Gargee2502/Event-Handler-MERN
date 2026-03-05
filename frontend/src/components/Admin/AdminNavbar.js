// frontend/src/components/Admin/AdminNavbar.js
import React, { useState } from 'react';
import LogoutModal from './LogoutModal'; // Import the new modal

const AdminNavbar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // If logged out, render a completely blank page
  if (isLoggedOut) {
    return <div style={{ height: '100vh', background: 'white' }}></div>;
  }

  return (
    <>
      <nav style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 24px', 
        background: 'white', 
        borderBottom: '1px solid #f0eefc',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b5ce7', fontWeight: 'bold' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6b5ce7' }}></div>
          Event Handler <span style={{ fontSize: '0.7rem', color: '#e8615a', marginLeft: '4px' }}>Admin</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.8rem', color: '#7a7a8c' }}>Dashboard</span>
          {/* Avatar click triggers the modal */}
          <div 
            onClick={() => setIsLogoutModalOpen(true)}
            style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, #fad5b0, #f4c5c5)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 'bold', border: '2px solid #e8615a',
              cursor: 'pointer'
            }}
          >
            AD
          </div>
        </div>
      </nav>

      {/* Integrate the Modal */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onLogout={() => {
          setIsLogoutModalOpen(false);
          setIsLoggedOut(true); // Triggers the blank page view
        }}
      />
    </>
  );
};

export default AdminNavbar;