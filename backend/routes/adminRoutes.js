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
const certificateController = require('../controllers/adminControllers/certificateController');
const feeController = require('../controllers/adminControllers/feeController');
const quizController = require('../controllers/adminControllers/quizController');

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "111222";
const JWT_SECRET = process.env.JWT_SECRET;

const Counter = require('../model/Counter');

// Multer for Course Images
const courseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/courses/');
  },
  filename: async (req, file, cb) => {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: 'course_pic' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const ext = path.extname(file.originalname);
      cb(null, `CRS-${counter.seq}${ext}`);
    } catch (error) {
      cb(error);
    }
  }
});
const upload = multer({ storage: courseStorage });

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

// Certificate Routes
router.get('/certificates', certificateController.getCertificates);
router.post('/certificates/generate', certificateController.generateCertificate);
router.delete('/certificates/:id', certificateController.deleteCertificate);

// Fee Routes
router.get('/fees', feeController.getAllFees);
router.post('/fees/generate', feeController.generateChallan);
router.put('/fees/:id/status', feeController.updateFeeStatus);
router.delete('/fees/:id', feeController.deleteChallan);

// Quiz Routes
router.post('/quizzes', quizController.createQuiz);
router.get('/quizzes', quizController.getAllQuizzes);
router.get('/quizzes/attempts', quizController.getQuizAttempts);
router.delete('/quizzes/:id', quizController.deleteQuiz);

module.exports = router;
