const Quiz = require('../../model/Quiz');
const QuizAttempt = require('../../model/QuizAttempt');

// Create a new quiz for a course
exports.createQuiz = async (req, res) => {
  try {
    const { title, course, questions } = req.body;

    if (!title || !course || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields and add at least one question."
      });
    }

    const newQuiz = new Quiz({
      title,
      course,
      questions
    });

    await newQuiz.save();

    res.status(201).json({
      success: true,
      message: "Quiz assigned successfully!",
      quiz: newQuiz
    });
  } catch (error) {
    console.error("Error in createQuiz:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating quiz"
    });
  }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error("Error in getAllQuizzes:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting quizzes"
    });
  }
};

// Get all student attempts / scores
exports.getQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find().sort({ attemptedAt: -1 });
    res.status(200).json({
      success: true,
      attempts
    });
  } catch (error) {
    console.error("Error in getQuizAttempts:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting quiz scores"
    });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Also delete attempts for this quiz
    await QuizAttempt.deleteMany({ quizId: id });

    res.status(200).json({
      success: true,
      message: "Quiz and all student scores associated deleted successfully!"
    });
  } catch (error) {
    console.error("Error in deleteQuiz:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting quiz"
    });
  }
};
