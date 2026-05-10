const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Controllers
const dashboardController = require('../controllers/adminControllers/dashboardController');
const admissionController = require('../controllers/adminControllers/admissionController');
const courseController = require('../controllers/adminControllers/courseController');
const enrolledController = require('../controllers/adminControllers/enrolledController');

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "111222";
const JWT_SECRET = process.env.JWT_SECRET;

// Multer for Course Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/courses/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Admin Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }
});

// Dashboard Stats
router.get('/dashboard', dashboardController.getDashboardStats);

// Admissions
router.get('/admissions', admissionController.getAdmissions);
router.put('/students/:id', admissionController.updateStudent);

// Courses
router.post('/courses', upload.single('image'), courseController.addCourse);
router.get('/courses', courseController.getCourses);
router.put('/courses/:id', upload.single('image'), courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);
router.get('/courses/:courseName/students', courseController.getCourseEnrolledStudents);

// Enrolled Students
router.get('/enrolled', enrolledController.getEnrolledStudents);
router.put('/enrolled/:id', enrolledController.updateEnrolledStudent);

module.exports = router;
