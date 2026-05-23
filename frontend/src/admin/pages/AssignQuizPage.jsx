import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  CheckCircle, 
  BookOpen, 
  FileText, 
  Award, 
  Calendar, 
  Users, 
  HelpCircle,
  Check
} from 'lucide-react';

const AssignQuizPage = () => {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'assigned', 'results'

  // Quiz Form State
  const [quizTitle, setQuizTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Courses
      const resCourses = await fetch('http://localhost:5000/api/admin/courses', { headers });
      const dataCourses = await resCourses.json();
      if (dataCourses.success) setCourses(dataCourses.courses);

      // Fetch Quizzes
      const resQuizzes = await fetch('http://localhost:5000/api/admin/quizzes', { headers });
      const dataQuizzes = await resQuizzes.json();
      if (dataQuizzes.success) setQuizzes(dataQuizzes.quizzes);

      // Fetch Student Attempts / Marks
      const resAttempts = await fetch('http://localhost:5000/api/admin/quizzes/attempts', { headers });
      const dataAttempts = await resAttempts.json();
      if (dataAttempts.success) setAttempts(dataAttempts.attempts);

    } catch (error) {
      console.error("Error fetching admin quiz data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new empty question to the list
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }
    ]);
  };

  // Remove a question
  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) return;
    const newQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(newQuestions);
  };

  // Update question text
  const handleQuestionTextChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  // Update question option value
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  // Update correct option index
  const handleCorrectOptionChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOptionIndex = parseInt(value);
    setQuestions(newQuestions);
  };

  // Submit Quiz Creation
  const handleSubmitQuiz = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      alert("Please select a course!");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        alert(`Please enter question text for Question ${i + 1}`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          alert(`Please fill option ${j + 1} for Question ${i + 1}`);
          return;
        }
      }
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: quizTitle,
          course: selectedCourse,
          questions: questions
        })
      });

      const data = await response.json();
      if (data.success) {
        alert("Quiz assigned successfully!");
        setQuizTitle('');
        setSelectedCourse('');
        setQuestions([{ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }]);
        fetchData();
        setActiveTab('assigned');
      } else {
        alert(data.message || "Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Something went wrong!");
    }
  };

  // Delete an assigned quiz
  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz? This will also delete all student score records for this quiz!")) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/quizzes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div className="space-y-8 font-roboto animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="bg-white -mx-8 -mt-8 px-8 py-6 border-b border-gray-100 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-[1600px] mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <ClipboardList size={24} />
              </div>
              Quiz Assessment Board
            </h1>
            <p className="text-gray-500 text-sm mt-1 ml-11">Assign course assessment quizzes and monitor student performance marks.</p>
          </div>

          {/* Navigation Tabs inside Header */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200">
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${activeTab === 'create' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Assign New Quiz
            </button>
            <button 
              onClick={() => setActiveTab('assigned')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${activeTab === 'assigned' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Assigned Quizzes ({quizzes.length})
            </button>
            <button 
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${activeTab === 'results' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Students Marks Board ({attempts.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        {/* TAB 1: Create/Assign Quiz */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Plus size={20} className="text-green-600" /> Create Dynamic Assessment
                </h2>
                <p className="text-xs text-gray-400">Enrolled students in the selected course will instantly see this quiz in their student portals.</p>
              </div>

              <form onSubmit={handleSubmitQuiz} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Target Enrolled Course</label>
                    <select
                      required
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none font-bold text-gray-700 transition"
                    >
                      <option value="">Select Target Course...</option>
                      {courses.map(c => (
                        <option key={c._id} value={c.title}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Quiz Title</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Midterm HTML/CSS Quiz"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none font-bold text-gray-700 transition"
                    />
                  </div>
                </div>

                {/* Questions Section */}
                <div className="space-y-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Assessment Questions</h3>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="text-xs text-green-600 hover:text-green-700 font-bold flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 hover:bg-green-100 transition"
                    >
                      <Plus size={14} /> Add Another Question
                    </button>
                  </div>

                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 relative space-y-4 animate-in slide-in-from-top-2 duration-300">
                      {/* Delete Button */}
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-md border border-green-150">Question {qIdx + 1}</span>
                        <input 
                          type="text"
                          required
                          placeholder="Type question text here..."
                          value={q.questionText}
                          onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                          className="w-full mt-2 p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-medium text-gray-700 transition"
                        />
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">Option {oIdx + 1}</label>
                            <input 
                              type="text"
                              required
                              placeholder={`Option ${oIdx + 1} content`}
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-medium text-gray-650 transition text-sm"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Correct Option Select */}
                      <div className="pt-2 flex flex-col md:flex-row md:items-center gap-3">
                        <span className="text-xs font-bold text-gray-500">Correct Answer Selection:</span>
                        <div className="flex gap-4">
                          {[0, 1, 2, 3].map((num) => (
                            <label key={num} className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name={`correct-${qIdx}`}
                                checked={q.correctOptionIndex === num}
                                onChange={() => handleCorrectOptionChange(qIdx, num)}
                                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500" 
                              />
                              <span className="text-xs font-bold text-gray-650">Option {num + 1}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Action */}
                <div className="pt-6 flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 transition"
                  >
                    <CheckCircle size={18} /> Assign & Post to Portal
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Guidelines */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <HelpCircle size={18} className="text-green-500" /> Guidelines
                </h3>
                <ul className="space-y-3 text-xs text-gray-500 leading-relaxed list-disc pl-4">
                  <li><strong>Target Course Assignment:</strong> Only student accounts with status <span className="text-green-600 font-bold bg-green-50 px-1 py-0.5 rounded">Enrolled</span> matching this course will see and attempt this quiz.</li>
                  <li><strong>Multiple Quizzes:</strong> A course can be assigned multiple quizzes. We record attempts per quiz so student history will not be overwritten.</li>
                  <li><strong>Options Layout:</strong> Fill all 4 available choices before posting to guarantee student answers load flawlessly.</li>
                  <li><strong>Real-time Indicators:</strong> A notification badge (red pulse dot) will automatically illuminate on targeted students' sidebar until they attempt the quiz.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Assigned Quizzes */}
        {activeTab === 'assigned' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-850">Active Posted Quizzes</h2>
              <p className="text-xs text-gray-400 mt-1">Quizzes currently live and visible inside the student portals.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Quiz Info</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Target Course</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Questions Count</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Date Assigned</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading active quizzes...</td></tr>
                  ) : quizzes.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No quizzes assigned yet.</td></tr>
                  ) : (
                    quizzes.map((q) => (
                      <tr key={q._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <FileText size={16} className="text-gray-400" /> {q.title}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full uppercase tracking-tight">
                            {q.course}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-650 flex items-center gap-1.5">
                            <HelpCircle size={14} className="text-gray-400" /> {q.questions.length} Questions
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                            <Calendar size={14} /> {new Date(q.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteQuiz(q._id)}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition"
                            title="Delete Quiz"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Student Marks Board */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-850 text-green-700">Student Assessment Scores</h2>
              <p className="text-xs text-gray-400 mt-1">Live grading sheet recording students' submitted quiz scores.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Student Info</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Course Enrolled</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Quiz Attempted</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Score Grade</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading student scores...</td></tr>
                  ) : attempts.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No student has attempted any quizzes yet.</td></tr>
                  ) : (
                    attempts.map((att) => {
                      const pct = Math.round((att.score / att.totalQuestions) * 100);
                      let gradeColor = "text-red-700 bg-red-50 border-red-200";
                      if (pct >= 80) gradeColor = "text-green-700 bg-green-50 border-green-200";
                      else if (pct >= 50) gradeColor = "text-yellow-700 bg-yellow-50 border-yellow-200";

                      return (
                        <tr key={att._id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                              <Users size={16} className="text-gray-400" /> {att.studentName}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-gray-500">{att.course}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                              <Award size={14} className="text-green-600" /> {att.quizTitle}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-4 py-1.5 text-xs font-bold rounded-full border ${gradeColor}`}>
                              {att.score} / {att.totalQuestions} ({pct}%)
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-bold text-gray-400">
                              {new Date(att.attemptedAt).toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignQuizPage;
