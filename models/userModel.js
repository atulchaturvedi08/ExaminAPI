const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, // Full name is required
        trim: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
        unique: true, // Ensure username is unique
    },
    email: {
        type: String,
        required: true, // Email is required
        unique: true, // Ensure the email is unique
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Validate email format
    },
    phone: {
        type: String,
        required: true, // Phone number is required
        unique: true, // Ensure phone number is unique
        match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'], // Validate phone format
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false, // Default to a regular user
    },
    isActive: {
        type: Boolean,
        default: true, // Default to active status
    },
}, {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` timestamps
});

// Pre-save hook for processing fullName and auto-generating username
userSchema.pre('save', async function (next) {
    // Split fullName into firstName and lastName
    if (this.fullName && (!this.firstName || !this.lastName)) {
        const nameParts = this.fullName.split(' ');
        this.firstName = nameParts[0];
        this.lastName = nameParts.slice(1).join(' ') || ''; // Handle cases with only one name
    }

    // Auto-generate username if it doesn't exist
    if (!this.username) {
        const randomNum = Math.floor(Math.random() * 1000); // Generate random number (0–9)
        this.username = `${this.firstName.toUpperCase()}${randomNum}`;
    }

    // Hash the password before saving
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
