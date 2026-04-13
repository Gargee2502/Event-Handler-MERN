import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    
    // Safely parse the user object
    let user = null;
    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (e) {
        user = null;
    }

    // 🕵️ DEBUG LOGS
    console.log("AdminRoute - User Role Found:", user?.role);

    // 🎯 Use strict lowercase comparison
    if (!token || !user || user.role !== "admin") {
        console.log("❌ Access Denied: Redirecting to Home");
        return <Navigate to="/" />; 
    }

    console.log("✅ Access Granted: Welcome Admin");
    return children;
}

export default AdminRoute;