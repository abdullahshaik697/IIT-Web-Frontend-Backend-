import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CreditCard, 
  Award, 
  Bell, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('studentToken');
        const response = await fetch('http://localhost:5000/api/user-portal/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
          setData(result.stats);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading Dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-red-500 font-medium">Failed to load portal data.</div>;

  const stats = [
    { title: 'Total Courses', value: data.totalCourses, icon: BookOpen, color: 'bg-blue-500', sub: 'Active Enrollments' },
    { title: 'Fees Paid', value: `Rs. ${data.totalPaid}`, icon: CreditCard, color: 'bg-green-500', sub: 'Cleared' },
    { title: 'Fees Remaining', value: `Rs. ${data.totalRemaining}`, icon: AlertCircle, color: 'bg-red-500', sub: 'Pending' },
    { title: 'Certificates', value: data.certificatesEarned, icon: Award, color: 'bg-purple-500', sub: 'Earned' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-outfit">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, <span className="text-green-600">{data.studentName}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Check your course progress and financial status.</p>
        </div>
      </div>

      {/* Stats Grid - Matching Admin Card Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-sm`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              <p className="text-gray-400 text-[10px] mt-1 font-medium">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Course Completion</h3>
            
            <div className="space-y-8">
              {data.courseProgress.map((cp, idx) => (
                <div key={idx} className="space-y-3">
                   <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-700">{cp.courseName}</span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{cp.progress}% Complete</span>
                   </div>
                   <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${cp.progress}%` }}
                      ></div>
                   </div>
                   <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={12}/> Time remaining: 4 Months</span>
                      <span className="flex items-center gap-1"><CheckCircle2 size={12}/> Progress: On Track</span>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button className="p-5 bg-green-600 rounded-2xl text-white font-bold text-sm flex items-center justify-between hover:bg-green-700 transition shadow-sm">
                <span>Download Fee Challan</span>
                <CreditCard size={18} />
             </button>
             <button className="p-5 bg-gray-900 rounded-2xl text-white font-bold text-sm flex items-center justify-between hover:bg-black transition shadow-sm">
                <span>Verification Request</span>
                <AlertCircle size={18} />
             </button>
          </div>
        </div>

        {/* Notifications Sidebar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Notifications</h3>
          
          <div className="space-y-5">
            {data.notifications.map((notif) => (
              <div key={notif.id} className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer group">
                <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${notif.type === 'fee' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                   {notif.type === 'fee' ? <CreditCard size={16} /> : <TrendingUp size={16} />}
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-800 leading-tight group-hover:text-green-600 transition">{notif.message}</p>
                   <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{notif.date}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 border border-gray-100 bg-gray-50 rounded-xl text-gray-500 font-bold text-xs hover:bg-gray-100 transition">
             View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;