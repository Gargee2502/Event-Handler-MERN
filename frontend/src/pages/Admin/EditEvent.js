// frontend/src/pages/EditEvent.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import AdminNavbar from '../../components/Admin/AdminNavbar';
import Sidebar from '../../components/Admin/Sidebar';
import { fetchEventById, updateEvent } from '../../api/eventApi'; 
import { Save, Upload, Calendar, Clock, MapPin, Users, Mic, Building2, Layers, X } from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Workshop',
    eventDescription: '',
    date: '',
    time: '',
    venue: '',
    organisedBy: '',
    speaker: '',
    totalSeats: 0,
    seatsTaken: 0,
    eventImage: '' // 1. Added to hold the Base64 image string
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const { data } = await fetchEventById(id);
        setFormData(data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        alert("Could not load event data.");
      }
    };
    getEventDetails();
  }, [id]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. NEW: Image Upload Logic for Editing ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({ ...formData, eventImage: reader.result }); // Replaces old image string
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, eventImage: '' });
  };
  // ----------------------------------------------

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(id, formData);
      alert("✅ Event updated successfully!");
      navigate('/'); 
    } catch (error) {
      console.error("Error updating event:", error);
      alert("❌ Failed to update event. Ensure backend limits allow large images.");
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#6b5ce7', fontWeight: 'bold' }}>Loading Event Data...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ef' }}>
      <AdminNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main style={{ flex: 1, padding: '30px', transition: 'all 0.3s ease' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '10px' }}>📝 Edit Event Details</h2>
            <p style={{ fontSize: '0.8rem', color: '#7a7a8c', marginBottom: '30px' }}>Modify core details and filters for your event.</p>

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
                {/* --- 3. UPDATED: Image Replace Section --- */}
                <div style={{ flex: '1 1 250px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c', display: 'block', marginBottom: '8px' }}>Event Poster</label>
                  <div style={{ position: 'relative', border: '2px dashed #ddd6f7', borderRadius: '12px', height: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafbff', cursor: 'pointer', overflow: 'hidden' }}>
                    {formData.eventImage ? (
                      <>
                        <img src={formData.eventImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={(e) => { e.preventDefault(); removeImage(); }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(232, 97, 90, 0.8)', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer', color: 'white' }}>
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload size={32} style={{ color: '#6b5ce7', marginBottom: '10px' }} />
                        <span style={{ fontSize: '0.75rem', color: '#7a7a8c' }}>Replace Image</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                      </>
                    )}
                  </div>
                </div>

                {/* Name, Type & Description Section */}
                <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 2 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}>Event Name</label>
                      <input name="eventName" type="text" value={formData.eventName} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c', display: 'flex', alignItems: 'center', gap: '5px' }}><Layers size={14}/> Event Type</label>
                      <select 
                        name="eventType" 
                        value={formData.eventType} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef', cursor: 'pointer' }}
                      >
                        <option value="Hackathon">Hackathon</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}>Event Description</label>
                    <textarea name="eventDescription" value={formData.eventDescription} onChange={handleChange} rows="5" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef', resize: 'none' }} />
                  </div>
                </div>
              </div>

              {/* Logistics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}><Calendar size={14} /> Date</label>
                  <input name="date" type="text" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}><Clock size={14} /> Time</label>
                  <input name="time" type="text" value={formData.time} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}><MapPin size={14} /> Venue</label>
                  <input name="venue" type="text" value={formData.venue} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
                </div>
              </div>

              {/* People Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}><Building2 size={14} /> Organised By</label>
                  <input name="organisedBy" type="text" value={formData.organisedBy} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}><Mic size={14} /> Speaker</label>
                  <input name="speaker" type="text" value={formData.speaker} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: '#f7f3ef' }} />
                </div>
              </div>

              {/* Seating Row */}
              <div style={{ display: 'flex', gap: '20px', background: '#fcf8ff', padding: '20px', borderRadius: '15px', border: '1px solid #ddd6f7' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}><Users size={14} /> Total Seats</label>
                  <input name="totalSeats" type="number" value={formData.totalSeats} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #f0eefc', background: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7a7a8c' }}>Seats Taken</label>
                  <input type="number" value={formData.seatsTaken} disabled style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f0f0f0', cursor: 'not-allowed' }} />
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#2cbf8a', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                <Save size={20} /> Update and Save Changes
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditEvent;