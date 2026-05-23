const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/userPortalControllers/settingsController');
const authController = require('../controllers/userPortalControllers/authController');
const dashboardController = require('../controllers/userPortalControllers/dashboardController');
const coursesController = require('../controllers/userPortalControllers/coursesController');
const verificationController = require('../controllers/userPortalControllers/verificationController');
const quizController = require('../controllers/userPortalControllers/quizController');
const { studentAuth } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const Counter = require('../model/Counter');

// Multer for Profile Picture updates
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/students/');
    },
    filename: async (req, file, cb) => {
        try {
            const counter = await Counter.findOneAndUpdate(
                { id: 'student_pic' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            const ext = path.extname(file.originalname);
            cb(null, `PP-ST-${counter.seq}${ext}`);
        } catch (error) {
            cb(error);
        }
    }
});
const upload = multer({ storage: storage });

// Auth Routes
router.post('/login', authController.login);
router.get('/dashboard', studentAuth, dashboardController.getDashboardStats);
router.get('/my-courses', studentAuth, coursesController.getMyCourses);
router.post('/drop-course', studentAuth, coursesController.dropCourse);

// Verification Routes
router.get('/fee-history', studentAuth, verificationController.getFeeHistory);
router.get('/search-challan/:challanNo', studentAuth, verificationController.searchChallan);
router.get('/verify-certificate/:certificateNo', verificationController.verifyCertificate); // Publicly verifiable

// Profile Routes
router.get('/profile', studentAuth, settingsController.getProfile);
router.put('/profile', studentAuth, upload.single('photo'), settingsController.updateProfile);
router.put('/change-password', studentAuth, settingsController.changePassword);

// Quiz Routes
router.get('/quizzes', studentAuth, quizController.getAvailableQuizzes);
router.post('/quizzes/attempt', studentAuth, quizController.attemptQuiz);

module.exports = router;
