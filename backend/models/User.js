const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    // 🎯 ROLE-BASED ACCESS CONTROL (RBAC)
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },
    
    // 🎓 STUDENT PROFILE FIELDS (Added for UserDetails.jsx)
    phone: { 
        type: String, 
        default: "" 
    },
    college: { 
        type: String, 
        default: "" 
    },
    year: { 
        type: String, 
        default: "" 
    },

    otp: {
        type: String,
        default: null
    },
    verified: {
        type: Boolean,
        default: false
    },
    
    // 📅 EVENT TRACKING
    registeredEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    ]
}, { 
    timestamps: true // Automatically tracks account creation and updates
});

module.exports = mongoose.model("User", userSchema);