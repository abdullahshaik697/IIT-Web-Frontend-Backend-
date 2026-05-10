const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certNo: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  courseName: { type: String, required: true },
  duration: { type: String, required: true },
  issueDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema, 'Certificates');
