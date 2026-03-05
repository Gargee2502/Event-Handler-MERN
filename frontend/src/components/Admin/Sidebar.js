// frontend/src/components/Admin/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, Plus, Trash2, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      width: isOpen ? '220px' : '70px', 
      borderRight: '1px solid #f0eefc', 
      padding: '20px 10px', 
      background: '#fafbff', 
      minHeight: 'calc(100vh - 60px)',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center', marginBottom: '20px' }}>
        {isOpen && (
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#e8615a', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ChevronDown size={16} /> Filters
          </div>
        )}
        <Menu size={20} style={{ color: '#e8615a', cursor: 'pointer' }} onClick={toggleSidebar} />
      </div>

      {/* Filter Sections */}
      <div style={{ marginBottom: '20px', display: isOpen ? 'block' : 'none' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#e8615a', textTransform: 'uppercase', marginBottom: '10px' }}>Event Type</p>
        {['Hackathon', 'Workshop', 'Seminar'].map(type => (
          <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', marginBottom: '6px' }}>
            <input type="checkbox" defaultChecked /> {type}
          </label>
        ))}
      </div>

      <div style={{ height: '1px', background: '#f0eefc', margin: '15px 0' }}></div>

      {/* Admin Actions */}
      <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#e8615a', textTransform: 'uppercase', marginBottom: '10px', textAlign: isOpen ? 'left' : 'center' }}>
        {isOpen ? 'Admin Actions' : '⚙️'}
      </p>
      
      {/* NEW: Show Events (Reverts back to Dashboard) */}
      <button 
        onClick={() => navigate('/')}
        style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#fcf8ff', border: '1.2px solid #ece8fc', display: 'flex', justifyContent: isOpen ? 'space-between' : 'center', alignItems: 'center', cursor: 'pointer', marginBottom: '8px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: '600', color: '#6b5ce7' }}>
          <LayoutDashboard size={16} /> {isOpen && "Show Events"}
        </div>
        {isOpen && <span style={{ color: '#6b5ce7' }}>›</span>}
      </button>

      <button 
        onClick={() => navigate('/add-event')}
        style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#fcf8ff', border: '1.2px solid #ece8fc', display: 'flex', justifyContent: isOpen ? 'space-between' : 'center', alignItems: 'center', cursor: 'pointer', marginBottom: '8px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: '600', color: '#6b5ce7' }}>
          <Plus size={16} /> {isOpen && "Add Event"}
        </div>
        {isOpen && <span style={{ color: '#6b5ce7' }}>›</span>}
      </button>

      <button 
        onClick={() => navigate('/deleted-events')}
        style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#fcf8ff', border: '1.2px solid #ece8fc', display: 'flex', justifyContent: isOpen ? 'space-between' : 'center', alignItems: 'center', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: '600', color: '#e8615a' }}>
          <Trash2 size={16} /> {isOpen && "Deleted Events"}
        </div>
        {isOpen && <span style={{ color: '#e8615a' }}>›</span>}
      </button>
    </div>
  );
};

export default Sidebar;