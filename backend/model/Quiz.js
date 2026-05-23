const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true // Assigned to a specific course (e.g. "Graphic Designing", "Web Development")
  },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }], // 4 choices
      correctOptionIndex: { type: Number, required: true } // 0 to 3
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema, 'Quizzes');
