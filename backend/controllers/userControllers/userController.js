const Student = require('../../model/Student');

// 1. Apply for Admission
const applyAdmission = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      dob,
      qualification,
      cnic,
      address,
      whatsapp,
      email,
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
      email,
      course,
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
      message: "Server error during admission submission"
    });
  }
};

module.exports = {
  applyAdmission
};
