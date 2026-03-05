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
  Image as ImageIcon 
} from 'lucide-react';

const EventTable = ({ onDeleteClick }) => {
  const navigate = useNavigate();

  // Expanded mock data to make the UI look appealing
  const events = [
    { 
      name: "HackForge 2025", 
      description: "An epic 48-hour hackathon to build world-changing solutions for global sustainability.",
      totalSeats: 200, seatsTaken: 185, participants: 185,
      host: "TechClub IITD", speaker: "Dr. Rahul Sharma",
      date: "Mar 15, 2025", time: "09:00 AM", venue: "Main Auditorium",
      posterBg: "#ddd6f7" // Lavender
    },
    { 
      name: "AI & Ethics Talk", 
      description: "A deep dive into the future of Artificial Intelligence and its social impact in 2026.",
      totalSeats: 150, seatsTaken: 45, participants: 45,
      host: "Innovate Hub", speaker: "Priya Mehta (Anthropic)",
      date: "Apr 05, 2025", time: "04:30 PM", venue: "Seminar Hall B",
      posterBg: "#c5e8d8" // Mint
    },
    { 
      name: "Startup Funding 101", 
      description: "Learn how to pitch your ideas to VCs and secure your first round of seed funding.",
      totalSeats: 100, seatsTaken: 95, participants: 95,
      host: "E-Cell Global", speaker: "Aniket Verma",
      date: "May 12, 2025", time: "11:00 AM", venue: "Online (Google Meet)",
      posterBg: "#fad5b0" // Peach
    },
    { 
      name: "Web3 Developer Summit", 
      description: "Master Smart Contracts and decentralized apps in this hands-on technical summit.",
      totalSeats: 300, seatsTaken: 150, participants: 150,
      host: "Blockchain Society", speaker: "Sarah Jenkins",
      date: "June 20, 2025", time: "10:00 AM", venue: "City Convention Center",
      posterBg: "#bfe3f5" // Sky Blue
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {events.map((event, index) => {
        const seatsRem = event.totalSeats - event.seatsTaken;
        return (
          <div key={index} style={{ 
            background: 'white', borderRadius: '15px', padding: '20px', 
            display: 'flex', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #f0eefc', transition: 'transform 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Poster Placeholder with dynamic background */}
            <div style={{ 
              width: '180px', height: '230px', background: event.posterBg, 
              borderRadius: '10px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: '#6b5ce7', flexShrink: 0 
            }}>
              <ImageIcon size={40} />
            </div>

            {/* Content Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#2d2d2d' }}>{event.name}</h2>
                <span style={{ fontSize: '0.65rem', background: '#f0eefc', padding: '4px 8px', borderRadius: '10px', color: '#6b5ce7', fontWeight: 'bold' }}>EVENT ID: #{100 + index}</span>
              </div>
              
              <p style={{ fontSize: '0.85rem', color: '#7a7a8c', lineHeight: '1.4', fontStyle: 'italic' }}>"{event.description}"</p>

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

              {/* Participant & Host Data */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '0.8rem', color: '#2d2d2d' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Users size={14} color="#6b5ce7"/> <strong>{event.participants} Participants Registered</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} color="#6b5ce7"/> {event.date} | <Clock size={14} color="#6b5ce7"/> {event.time}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} color="#6b5ce7"/> {event.venue}</div>
              </div>

              <div style={{ fontSize: '0.8rem', borderTop: '1px solid #f0eefc', paddingTop: '10px' }}>
                <span style={{ color: '#7a7a8c' }}>Organised by:</span> <strong>{event.host}</strong> &nbsp; | &nbsp; <span style={{ color: '#7a7a8c' }}>Speaker:</span> <strong>{event.speaker}</strong>
              </div>

              {/* Actions row updated with three buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button 
                  onClick={() => navigate('/edit-event')}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#ddd6f7', color: '#6b5ce7', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Edit3 size={16} /> Edit Details
                </button>
                
                {/* NEW BUTTON: Show Participants */}
                <button 
                  onClick={() => navigate('/participants')}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#bfe3f5', color: '#1a5a7a', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Users size={16} /> Show Participants
                </button>

                <button 
                  onClick={() => onDeleteClick(event.name)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#fff5f5', color: '#e8615a', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Trash2 size={16} /> Delete Event
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