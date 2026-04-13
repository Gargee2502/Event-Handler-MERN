const adminMiddleware = (req, res, next) => {
    // 1. Check if req.user exists and has the 'admin' role
    // The role must be included in your JWT payload during login
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to the controller
    } else {
        // 2. Deny access if they are a student or not logged in
        res.status(403).json({ 
            message: "Access denied. This action requires administrator privileges." 
        });
    }
};

module.exports = adminMiddleware;