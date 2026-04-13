// frontend/src/components/Admin/EventTable.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Edit3, 
  Trash2, 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  Image as ImageIcon,
  Tag
} from 'lucide-react';

const EventTable = ({ events, onDeleteClick }) => {
  const navigate = useNavigate();

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'Hackathon':
        return { bg: '#fff5f5', color: '#e8615a', border: '#f4c5c5' };
      case 'Workshop':
        return { bg: '#f0eefc', color: '#6b5ce7', border: '#ddd6f7' };
      case 'Seminar':
        return { bg: '#f0fff4', color: '#2cbf8a', border: '#c6f6d5' };
      default:
        return { bg: '#fafbff', color: '#7a7a8c', border: '#f0eefc' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {events && events.map((event, index) => {
        const seatsRem = event.totalSeats - event.seatsTaken;
        const badge = getBadgeStyle(event.eventType);

        return (
          <div key={event._id || index} style={{ 
            background: 'white', borderRadius: '15px', padding: '20px', 
            display: 'flex', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #f0eefc', transition: 'transform 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* --- UPDATED: Dynamic Poster Section --- */}
            <div style={{ 
              width: '180px', height: '230px', background: '#ddd6f7', 
              borderRadius: '10px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: '#6b5ce7', flexShrink: 0,
              overflow: 'hidden' // Ensures image doesn't spill out of rounded corners
            }}>
              {event.eventImage ? (
                <img 
                  src={event.eventImage} 
                  alt={event.eventName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <ImageIcon size={40} />
              )}
            </div>

            {/* Content Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: '6px', width: 'fit-content',
                    background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`
                  }}>
                    <Tag size={10} /> {event.eventType || 'N/A'}
                  </div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#2d2d2d', margin: 0 }}>
                    {event.eventName}
                  </h2>
                </div>
                <span style={{ fontSize: '0.65rem', background: '#f0eefc', padding: '4px 8px', borderRadius: '10px', color: '#6b5ce7', fontWeight: 'bold' }}>
                  EVENT ID: {event.eventID || `#${100 + index}`}
                </span>
              </div>
              
              <p style={{ fontSize: '0.85rem', color: '#7a7a8c', lineHeight: '1.4', fontStyle: 'italic' }}>
                "{event.eventDescription}"
              </p>

              {/* Seats Row */}
              <div style={{ display: 'flex', gap: '30px', background: '#fafbff', padding: '12px', borderRadius: '10px', border: '1px solid #f0eefc' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.65rem', color: '#7a7a8c', fontWeight: 'bold' }}>TOTAL SEATS</p>
                  <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{event.totalSeats}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.65rem', color: '#7a7a8c', fontWeight: 'bold' }}>TAKEN</p>
                  <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6b5ce7' }}>{event.seatsTaken}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.65rem', color: '#7a7a8c', fontWeight: 'bold' }}>REMAINING</p>
                  <p style={{ fontSize: '1rem', fontWeight: 'bold', color: seatsRem < 10 ? '#e8615a' : '#1a7a52' }}>{seatsRem}</p>
                </div>
              </div>

              {/* Logistics */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '0.8rem', color: '#2d2d2d' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Users size={14} color="#6b5ce7"/> <strong>{event.totalParticipants || 0} Registered</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} color="#6b5ce7"/> {event.date} | <Clock size={14} color="#6b5ce7"/> {event.time}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} color="#6b5ce7"/> {event.venue}</div>
              </div>

              {/* Actions row */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', borderTop: '1px solid #f0eefc', paddingTop: '15px' }}>
                <button 
                  onClick={() => navigate(`/edit-event/${event._id}`)} 
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#ddd6f7', color: '#6b5ce7', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Edit3 size={16} /> Edit Details
                </button>
                
                <button 
                  onClick={() => navigate(`/participants/${event._id}`)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#bfe3f5', color: '#1a5a7a', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Users size={16} /> Participants
                </button>

                <button 
                  onClick={() => onDeleteClick(event)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#fff5f5', color: '#e8615a', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventTable;