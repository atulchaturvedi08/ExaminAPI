// models/course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    coursePrice: {
        type: String
    },
    startDate: {
        type: Date,
        required: false,
    },
    image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
