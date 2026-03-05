import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminHome from './pages/AdminHome';
import AddEvent from './pages/AddEvent'; // Import the new page
import DeletedEvents from './pages/DeletedEvents';
import EditEvent from './pages/EditEvent';
import Participants from './pages/Participants';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/deleted-events" element={<DeletedEvents />} />
        <Route path="/edit-event" element={<EditEvent />} />
        <Route path="/participants" element={<Participants />} />
      </Routes>
    </Router>
  );
}

export default App;