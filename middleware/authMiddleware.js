const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect middleware to check for valid token
const protect = async (req, res, next) => {
    let token;

    // Check if token is in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' exmin profile')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Set user from the decoded token
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Admin-only route middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Admin privileges required' });
    }
};

module.exports = { protect, admin };
