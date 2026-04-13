const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // 1. Get token from the headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided. Authorization denied." });
    }

    // 2. Remove "Bearer " prefix
    const token = authHeader.split(" ")[1]; 

    try {
        // 3. Verify token using your JWT_SECRET from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach decoded payload (id, role, etc.) to the request
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid or has expired." });
    }
};

module.exports = authMiddleware;