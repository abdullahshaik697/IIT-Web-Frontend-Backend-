const Student = require('../../model/Student');
const Quiz = require('../../model/Quiz');
const QuizAttempt = require('../../model/QuizAttempt');

// Get all quizzes available for the student based on their enrolled course
exports.getAvailableQuizzes = async (req, res) => {
  try {
    const studentId = req.student.id;

    // Fetch student info
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Only students with status 'Enrolled' can view quizzes
    if (student.status !== 'Enrolled') {
      return res.status(200).json({
        success: true,
        quizzes: [],
        message: "Quizzes are only available for enrolled students."
      });
    }

    // Get quizzes assigned to student's course
    const quizzes = await Quiz.find({ course: student.course }).sort({ createdAt: -1 });

    // For each quiz, check if the student has already attempted it
    const quizzesWithStatus = await Promise.all(
      quizzes.map(async (quiz) => {
        const attempt = await QuizAttempt.findOne({
          studentId: studentId,
          quizId: quiz._id
        });

        return {
          _id: quiz._id,
          title: quiz.title,
          course: quiz.course,
          questionsCount: quiz.questions.length,
          createdAt: quiz.createdAt,
          attempted: !!attempt,
          score: attempt ? attempt.score : null,
          totalQuestions: attempt ? attempt.totalQuestions : null,
          attemptedAt: attempt ? attempt.attemptedAt : null,
          // Exclude correctOptionIndex from questions sent to client if not attempted yet, for security
          questions: attempt ? quiz.questions : quiz.questions.map(q => ({
            _id: q._id,
            questionText: q.questionText,
            options: q.options
          }))
        };
      })
    );

    res.status(200).json({
      success: true,
      quizzes: quizzesWithStatus
    });
  } catch (error) {
    console.error("Error in getAvailableQuizzes:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching quizzes"
    });
  }
};

// Submit/Attempt a quiz
exports.attemptQuiz = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { quizId, answers } = req.body; // answers is an object like { questionId: selectedIndex } or array

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // Check if already attempted
    const existingAttempt = await QuizAttempt.findOne({ studentId, quizId });
    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: "You have already attempted this quiz."
      });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      // Find matching user answer
      const userAnswerIndex = answers[q._id] !== undefined ? answers[q._id] : answers[idx];
      if (userAnswerIndex !== undefined && Number(userAnswerIndex) === q.correctOptionIndex) {
        score++;
      }
    });

    // Save attempt
    const newAttempt = new QuizAttempt({
      studentId: student._id,
      studentName: student.name,
      course: student.course,
      quizId: quiz._id,
      quizTitle: quiz.title,
      score: score,
      totalQuestions: quiz.questions.length
    });

    await newAttempt.save();

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully!",
      attempt: newAttempt
    });
  } catch (error) {
    console.error("Error in attemptQuiz:", error);
    res.status(500).json({
      success: false,
      message: "Server error submitting quiz"
    });
  }
};
