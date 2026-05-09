const express = require('express');
const router = express.Router();

const Student = require('../model/Student');
const multer = require('multer');
const path = require('path');

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

// Admission Form Submission
router.post('/admission', upload.single('photo'), async (req, res) => {
  try {
    const {
      name,
      fatherName,
      dob,
      qualification,
      cnic,
      address,
      whatsapp,
      course,
      timing,
      message
    } = req.body;

    const newStudent = new Student({
      name,
      fatherName,
      dob,
      qualification,
      cnic,
      address,
      whatsapp,
      course,
      timing,
      message,
      photo: req.file ? req.file.path : null
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      student: newStudent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error during submission"
    });
  }
});

// Test User Route
router.get('/test', (req, res) => {
  res.json({ message: "User route is working" });
});

module.exports = router;
