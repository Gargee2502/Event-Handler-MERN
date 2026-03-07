// frontend/src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserHomePage     from "./pages/UserHomePage";
import EventDetailPage  from "./pages/EventDetailPage";
import RegistrationPage from "./pages/RegistrationPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<UserHomePage />} />
        <Route path="/event/:id"           element={<EventDetailPage />} />
        <Route path="/event/:id/register"  element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;