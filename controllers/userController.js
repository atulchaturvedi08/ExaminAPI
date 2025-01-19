const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate a JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Register a new user
const registerUser = async (req, res) => {
    const { fullName, email, phone, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Create a new user
        const newUser = await User.create({
            fullName,
            email,
            phone,
            password,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                isActive: newUser.isActive,
            },
            token: generateToken(newUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Check if the user is active
        if (!user.isActive) {
            return res.status(403).json({ message: 'User account is deactivated. Please contact support.' });
        }

        // Compare passwords
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                isActive: user.isActive,
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user active status (Admin only)
const toggleUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { isActive } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = isActive;
        await user.save();

        res.status(200).json({
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { fullName, email, phone, password } = req.body;
    const userId = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, email, phone, password },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User details updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            const duplicateField = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `Duplicate value for ${duplicateField}: ${error.keyValue[duplicateField]}`,
            });
        }
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




module.exports = { registerUser, loginUser, getUserProfile, toggleUserStatus, updateUser };
