import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ── Authentication Wrappers ──────────────────────────────────────────────────
import ProtectedRoute from './components/User/ProtectedRoute';
import AdminRoute from './components/User/AdminRoute';        

// ── User Pages ──────────────────────────────────────────────────────────────
import Landing from './pages/User/Landing';          
import Login from './pages/User/Login';              
import Signup from './pages/User/Signup';            
import VerifyOTP from './pages/User/VerifyOTP';      
import ResetPassword from './pages/User/ResetPassword';
import Profile from './pages/User/Profile';          
import UserDetails from './pages/User/UserDetails';  

// ── Admin Pages ─────────────────────────────────────────────────────────────
import AdminHome from './pages/Admin/AdminHome';      
import AddEvent from './pages/Admin/AddEvent';        
import DeletedEvents from './pages/Admin/DeletedEvents'; // 🎯 Added for the Trash bin

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 🌏 1. Public Routes: Accessible to everyone */}
        <Route path="/" element={<Landing />} />          
        <Route path="/login" element={<Login />} />       
        <Route path="/signup" element={<Signup />} />     
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🎓 2. Student Routes: Must be logged in (Student or Admin) */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/user-details" element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        } />

        {/* 🔒 3. Admin Routes: ONLY accessible to users with role "admin" */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        } />

        <Route path="/add-event" element={
          <AdminRoute>
            <AddEvent />
          </AdminRoute>
        } />

        <Route path="/deleted-events" element={
          <AdminRoute>
            <DeletedEvents />
          </AdminRoute>
        } />

        {/* 🎯 Example for Edit (Uncomment and add import when ready):
        <Route path="/edit-event/:id" element={
          <AdminRoute>
            <EditEvent />
          </AdminRoute>
        } /> */}

      </Routes>
    </Router>
  );
}

export default App;