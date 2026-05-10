const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers/userController');
const courseController = require('../controllers/adminControllers/courseController');
const multer = require('multer');
const path = require('path');

// 0. Get Courses (for dropdown)
router.get('/courses', courseController.getCourses);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 1. Admission Form Submission
router.post('/admission', upload.single('photo'), userController.applyAdmission);

// Test User Route
router.get('/test', (req, res) => {
  res.json({ message: "User route is working" });
});

module.exports = router;
