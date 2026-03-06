// frontend/src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserHomePage from "./pages/UserHomePage";
import EventDetailPage from "./pages/EventDetailPage";
import RegisteredEventsPage from "./pages/RegisteredEventsPage"; // New

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserHomePage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/my-events" element={<RegisteredEventsPage />} /> {/* Add link to this from profile */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;