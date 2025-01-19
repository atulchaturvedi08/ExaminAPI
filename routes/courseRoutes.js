// routes/courseRoutes.js
const express = require('express');
const { addCourse, getCourses, updateCourse, deleteCourse   } = require('../controllers/courseController');
const router = express.Router();

// This will make the API available at /api/courses/addCourse
router.post('/addCourse', addCourse);

// GET route for fetching all courses
router.get('/', getCourses);  // This will return all courses when you visit /api/courses


// PUT route for updating a course by ID
router.put('/:id', updateCourse);  // The course ID will be passed as a URL parameter


// Delete Course
router.delete('/:id', deleteCourse); // deleteCourse के लिए नया route


module.exports = router;
