// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth & Base Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";

// Event Pages (From Gargee's Branch)
import UserHomePage from "./pages/UserHomePage";
import EventDetailPage from "./pages/EventDetailPage";
import RegistrationPage from "./pages/RegistrationPage";

// Protected Pages
import RegisteredEvents from "./pages/RegisteredEvents";
import Certificates from "./pages/Certificates";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Event Browsing & Registration Routes */}
        <Route path="/home" element={<UserHomePage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/event/:id/register" element={<RegistrationPage />} />

        {/* Protected User Routes */}

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <RegisteredEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;