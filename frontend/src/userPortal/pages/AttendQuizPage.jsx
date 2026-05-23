import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  HelpCircle, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  BookOpen,
  ChevronRight
} from 'lucide-react';

const AttendQuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null); // The quiz currently being attempted
  const [answers, setAnswers] = useState({}); // { questionId: selectedIndex }
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null); // Store result of recently finished quiz

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('http://localhost:5000/api/user-portal/quizzes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setQuizzes(data.quizzes);
      }
    } catch (error) {
      console.error("Error fetching available quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start taking a quiz
  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setAnswers({});
    setQuizResult(null);
  };

  // Handle option select
  const handleSelectOption = (questionId, optionIdx) => {
    setAnswers({
      ...answers,
      [questionId]: optionIdx
    });
  };

  // Submit Quiz Answers
  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    const unanswered = activeQuiz.questions.some(q => answers[q._id] === undefined);
    if (unanswered && !window.confirm("You have not answered all questions. Submit anyway?")) {
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('http://localhost:5000/api/user-portal/quizzes/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: activeQuiz._id,
          answers: answers
        })
      });

      const data = await response.json();
      if (data.success) {
        setQuizResult(data.attempt);
        setActiveQuiz(null);
        fetchQuizzes(); // Refresh list to update scores
      } else {
        alert(data.message || "Failed to submit quiz.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Something went wrong, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-roboto animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <ClipboardList size={24} />
            </div>
            Course Quiz Assessments
          </h1>
          <p className="text-gray-500 text-sm mt-1 ml-11">Attend quizzes assigned by your course instructors and view obtained marks.</p>
        </div>
      </div>

      {/* QUIZ TAKING INTERACTIVE SCREEN */}
      {activeQuiz && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in zoom-in duration-300">
          {/* Active Quiz Header */}
          <div className="bg-green-600 text-white p-8">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-green-100 text-xs font-bold uppercase tracking-widest">{activeQuiz.course} • Assessment</p>
                <h2 className="text-2xl font-bold mt-1">{activeQuiz.title}</h2>
              </div>
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to exit? Your progress in this quiz will be lost!")) {
                    setActiveQuiz(null);
                  }
                }}
                className="bg-black/20 hover:bg-black/35 text-white px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95"
              >
                Quit Quiz
              </button>
            </div>
          </div>

          {/* Questions Body */}
          <div className="p-8 space-y-8 max-w-4xl mx-auto">
            {activeQuiz.questions.map((q, idx) => (
              <div key={q._id} className="space-y-4">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <h3 className="text-md font-bold text-gray-800 pt-1 leading-relaxed">{q.questionText}</h3>
                </div>

                {/* Grid of Choices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q._id] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(q._id, oIdx)}
                        className={`p-4 text-left rounded-2xl font-bold text-sm border-2 transition-all duration-200 active:scale-98 flex justify-between items-center ${
                          isSelected 
                            ? 'bg-green-50 border-green-500 text-green-700 shadow-md shadow-green-200/50' 
                            : 'bg-gray-50 border-transparent text-gray-650 hover:bg-gray-100/50 hover:border-gray-200'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center border border-green-600 shadow-sm animate-in scale-in duration-200">
                            <CheckCircle2 size={12} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Submission actions */}
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-green-600/20 transition active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Submitting Answers..." : "Submit Completed Quiz"} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ RESULT SCORE SCREEN */}
      {quizResult && !activeQuiz && (
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl max-w-xl mx-auto text-center space-y-6 animate-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-300 text-green-600 flex items-center justify-center mx-auto shadow-md">
            <Award size={48} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full border border-green-200">Assessment Submitted</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Quiz Finished!</h2>
            <p className="text-gray-400 text-sm mt-1">Assessment name: <strong>{quizResult.quizTitle}</strong></p>
          </div>

          <div className="bg-gray-50 py-6 px-8 rounded-2xl max-w-xs mx-auto border border-gray-100">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Your Score Grade</p>
            <p className="text-4xl font-extrabold text-green-600 mt-2">
              {quizResult.score} <span className="text-xl font-bold text-gray-400">/ {quizResult.totalQuestions}</span>
            </p>
            <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase">
              {Math.round((quizResult.score / quizResult.totalQuestions) * 100)}% Grade Marks
            </p>
          </div>

          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Your instructor can see this score instantly in their Gradeboard. You can review your historical performance below at any time.
          </p>

          <button
            onClick={() => setQuizResult(null)}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition shadow-xl shadow-green-600/20 active:scale-95"
          >
            Back to Assessments Dashboard
          </button>
        </div>
      )}

      {/* DASHBOARD: List active unattempted quizzes and marks history */}
      {!activeQuiz && !quizResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Assessments List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BookOpen size={20} className="text-green-600" /> Pending Assessments
              </h2>
              <p className="text-xs text-gray-400 mt-1">Quizzes assigned by the administrator waiting for your attempt.</p>
              
              <div className="divide-y divide-gray-100 mt-6">
                {loading ? (
                  <p className="py-6 text-center text-gray-400 text-sm font-medium">Checking pending quizzes...</p>
                ) : quizzes.filter(q => !q.attempted).length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="text-gray-500 font-bold text-sm">All caught up!</p>
                    <p className="text-gray-400 text-xs">No pending assessments assigned for your course currently.</p>
                  </div>
                ) : (
                  quizzes.filter(q => !q.attempted).map((q) => (
                    <div key={q._id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded border border-green-150 uppercase tracking-tight">{q.course}</span>
                        <h3 className="text-md font-bold text-gray-850 pt-1">{q.title}</h3>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 pt-0.5">
                          <span className="flex items-center gap-1"><HelpCircle size={14} /> {q.questionsCount} Questions</span>
                          <span className="flex items-center gap-1"><Calendar size={14} /> Posted {new Date(q.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleStartQuiz(q)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-1 shadow-md shadow-green-600/10 active:scale-95 w-full sm:w-auto justify-center"
                        >
                          Start Quiz <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Historical Marks Side Sheet */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
            <h2 className="text-md font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Award size={18} className="text-green-600" /> Historical Course Marks
            </h2>
            <p className="text-xs text-gray-400 mt-1.5">Your past quiz scores obtained in your enrolled course.</p>
            
            <div className="space-y-4 mt-5 max-h-[350px] overflow-y-auto pr-1">
              {loading ? (
                <p className="text-center text-gray-400 text-xs">Loading history...</p>
              ) : quizzes.filter(q => q.attempted).length === 0 ? (
                <p className="text-center text-gray-450 text-xs py-4">No completed quiz history found yet.</p>
              ) : (
                quizzes.filter(q => q.attempted).map((q) => {
                  const pct = Math.round((q.score / q.totalQuestions) * 100);
                  let gradeColor = "text-red-600 bg-red-50";
                  if (pct >= 80) gradeColor = "text-green-600 bg-green-50";
                  else if (pct >= 50) gradeColor = "text-yellow-600 bg-yellow-50";

                  return (
                    <div key={q._id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center gap-3">
                      <div className="space-y-1 overflow-hidden">
                        <p className="text-xs font-bold text-gray-800 truncate">{q.title}</p>
                        <p className="text-[9px] font-bold text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> {new Date(q.attemptedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-3 py-1.5 text-xs font-extrabold rounded-lg flex-shrink-0 ${gradeColor}`}>
                        {q.score} / {q.totalQuestions}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendQuizPage;
