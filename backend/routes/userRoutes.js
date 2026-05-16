const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers/userController');
const courseController = require('../controllers/adminControllers/courseController');
const multer = require('multer');
const path = require('path');

// 0. Get Courses (for dropdown)
router.get('/courses', courseController.getCourses);

const Counter = require('../model/Counter');

// Multer Storage Configuration for Students
const studentStorage = multer.diskStorage({
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

const upload = multer({ storage: studentStorage });

// 1. Admission Form Submission
router.post('/admission', upload.single('photo'), userController.applyAdmission);

// Test User Route
router.get('/test', (req, res) => {
  res.json({ message: "User route is working" });
});

module.exports = router;
