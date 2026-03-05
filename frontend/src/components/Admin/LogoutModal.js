// frontend/src/components/Admin/LogoutModal.js
import React from 'react';
import { LogOut, X } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '24px', width: '300px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1.5px solid #ddd6f7'
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <X size={20} style={{ cursor: 'pointer', color: '#7a7a8c' }} onClick={onClose} />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👋</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#6b5ce7', marginBottom: '8px' }}>Logging Out?</h3>
          <p style={{ fontSize: '0.75rem', color: '#7a7a8c', marginBottom: '20px' }}>
            Are you sure you want to end your session?
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Cancel: Reverts back to home page (closes modal) */}
            <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #ece8fc', background: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
              Cancel
            </button>
            {/* Log Out: Shows blank page */}
            <button onClick={onLogout} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#e8615a', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;