// controllers/courseController.js
const Course = require('../models/course'); // Import Course model

const addCourse = async (req, res) => {
    const { courseName, description, duration, coursePrice, teacherName, startDate, image } = req.body;

    try {
        const newCourse = await Course.create({
            courseName,
            description,
            duration,
            coursePrice,
            teacherName,
            startDate,
            image,
        });

        res.status(201).json({
            message: "Course added successfully",
            course: {
                id: newCourse.id,
                courseName: newCourse.courseName,
                description: newCourse.description,
                duration: newCourse.duration,
                coursePrice: newCourse.coursePrice,
                teacherName: newCourse.teacherName,
                startDate: newCourse.startDate,
                image: newCourse.image,
                isActive: newCourse.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all Courses (GET method)
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();  // Fetch all courses from the database
        res.status(200).json(courses);  // Send the list of courses as response
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Course (PUT method)
const updateCourse = async (req, res) => {
    const { courseName, description, duration, coursePrice, teacherName, startDate, image, isActive } = req.body;
    const courseId = req.params.id;  // Get the course ID from the URL parameters

    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                courseName,
                description,
                duration,
                coursePrice,
                teacherName,
                startDate,
                image,
                isActive,  // If provided, this will update the course status
            },
            { new: true } // This option ensures the updated course is returned
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({
            message: 'Course updated successfully',
            course: updatedCourse,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Course
const deleteCourse = async (req, res) => {
    const courseId = req.params.id; // course ID को URL से प्राप्त करें

    try {
        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({
            message: 'Course deleted successfully',
            course: deletedCourse,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { addCourse, getCourses, updateCourse, deleteCourse };