import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, eventName }) => {
  if (!isOpen) return null; // Don't show anything if not open

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '24px', width: '320px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1.5px solid #f4c5c5'
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <X size={20} style={{ cursor: 'pointer', color: '#7a7a8c' }} onClick={onClose} />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🗑️</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8615a', marginBottom: '8px' }}>Delete Event?</h3>
          <p style={{ fontSize: '0.75rem', color: '#7a7a8c', marginBottom: '16px' }}>
            Are you sure you want to delete <strong>"{eventName}"</strong>? This action cannot be undone.
          </p>
          
          <div style={{ background: '#fff5f5', padding: '10px', borderRadius: '10px', marginBottom: '20px' }}>
            <p style={{ fontSize: '0.65rem', color: '#e8615a', fontWeight: '600' }}>
              <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Registered participants will be notified.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #ece8fc', background: 'white', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
            <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#e8615a', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Yes, Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;