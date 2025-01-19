const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUser, toggleUserStatus } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware'); // Use auth middleware here

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);

// Protected routes
router.route('/profile').get(protect, getUserProfile);

// Admin-only route to toggle user status
router.route('/toggle-status/:userId').put(protect, admin, toggleUserStatus);

module.exports = router;
