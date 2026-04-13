import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api'; //
import AdminNavbar from '../../components/Admin/AdminNavbar';
import Sidebar from '../../components/Admin/Sidebar';

const AddEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Hackathon',
    eventImage: '' // Base64 String
  });

  // Convert image to Base64
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, eventImage: reader.result });
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🎯 Uses protected API instance
      await API.post('/events', formData);
      navigate('/admin');
    } catch (err) {
      alert("Error: Check if your image is too large or if you are logged in as Admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ef' }}>
      <AdminNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar isOpen={true} />
        <main style={{ flex: 1, padding: '40px' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0', padding: '30px' }}>
            <h3 style={{ color: '#6b5ce7', marginBottom: '20px' }}>✨ New Event</h3>
            <form onSubmit={handleSubmit}>
              <label className="field-label">Event Name</label>
              <input type="text" required onChange={e => setFormData({...formData, eventName: e.target.value})} />
              
              <label className="field-label">Upload Poster</label>
              <input type="file" accept="image/*" onChange={handleImage} />

              <button type="submit" className="btn-primary" style={{ marginTop: '20px' }} disabled={loading}>
                {loading ? "Publishing..." : "🚀 Publish Event"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddEvent;