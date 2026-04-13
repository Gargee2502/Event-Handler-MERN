import React from 'react';
import { RefreshCw, X, CheckCircle2 } from 'lucide-react';

const RestoreModal = ({ isOpen, onClose, onConfirm, eventName }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '24px', width: '320px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1.5px solid #c5e8d8'
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <X size={20} style={{ cursor: 'pointer', color: '#7a7a8c' }} onClick={onClose} />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>♻️</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#1a7a52', marginBottom: '8px' }}>Restore Event?</h3>
          <p style={{ fontSize: '0.75rem', color: '#7a7a8c', marginBottom: '16px' }}>
            Are you sure you want to restore <strong>"{eventName}"</strong>? It will reappear on your active dashboard.
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #ece8fc', background: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
              Cancel
            </button>
            <button onClick={onConfirm} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#2cbf8a', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <RefreshCw size={14} /> Yes, Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestoreModal;