import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  XCircle, 
  CheckCircle2, 
  AlertTriangle,
  PlayCircle,
  ExternalLink
} from 'lucide-react';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('http://localhost:5000/api/user-portal/my-courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async () => {
    if (!window.confirm('Are you sure you want to drop this course?')) return;
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('http://localhost:5000/api/user-portal/drop-course', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('Course dropped successfully.');
        fetchMyCourses();
      }
    } catch (error) {
      console.error('Error dropping course:', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading courses...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-outfit">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your enrolled courses and progress.</p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
           <BookOpen className="mx-auto text-gray-300 mb-4" size={40} />
           <h3 className="text-lg font-bold text-gray-800">No active enrollments</h3>
           <p className="text-gray-500 text-sm mt-2">Enroll in a course to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row group transition hover:border-green-200">
              <div className="w-full md:w-56 h-48 md:h-auto bg-gray-100 relative">
                {course.image ? (
                  <img 
                    src={`http://localhost:5000/${course.image}`} 
                    alt={course.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <BookOpen size={40} />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                   <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                     course.status === 'Enrolled' ? 'bg-green-600 text-white' : 
                     course.status === 'Passout' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                   }`}>
                     {course.status}
                   </span>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-gray-800">{course.title}</h2>
                    <div className={`${course.isFeePaid ? 'text-green-600' : 'text-red-500'}`} title={course.isFeePaid ? 'Fees Paid' : 'Fees Pending'}>
                       {course.isFeePaid ? <CheckCircle2 size={18}/> : <AlertTriangle size={18}/>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed">
                    {course.description}
                  </p>


                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                   <button 
                     disabled={course.status !== 'Enrolled'}
                     className="flex items-center justify-center gap-2 py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition disabled:opacity-50"
                   >
                     <PlayCircle size={16} /> Continue
                   </button>
                   
                   {course.status === 'Passout' && course.isFeePaid ? (
                     <button className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition">
                       <Download size={16} /> Certificate
                     </button>
                   ) : (
                     <button 
                       onClick={handleDrop}
                       disabled={course.status === 'Dropout'}
                       className="flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-50 text-gray-500 text-xs font-bold hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                     >
                       <XCircle size={16} /> Drop Course
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
         <div>
            <h3 className="text-lg font-bold mb-1 tracking-tight">Access Learning Materials</h3>
            <p className="text-gray-400 text-sm font-medium">Download lecture notes and course resources instantly.</p>
         </div>
         <button className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-xl font-bold text-sm hover:bg-green-700 transition shadow-sm whitespace-nowrap">
            Open LMS <ExternalLink size={16} />
         </button>
      </div>
    </div>
  );
};

export default MyCourses;
