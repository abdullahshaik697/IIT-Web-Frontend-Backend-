import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CreditCard, 
  Award, 
  AlertCircle,
  Download,
  Calendar,
  CheckCircle2
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
    <div className="space-y-8 animate-in fade-in duration-500 font-roboto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, <span className="text-green-600">{data.studentName}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Check your course details and financial status.</p>
        </div>
      </div>

      {/* Stats Grid */}
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
        {/* Left Column: Courses & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Courses */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Active Courses</h3>
            <div className="space-y-4">
              {data.courseProgress && data.courseProgress.length > 0 ? (
                data.courseProgress.map((cp, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                         <BookOpen size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-gray-800">{cp.courseName}</span>
                        <p className="text-xs text-gray-500 mt-0.5">Currently Enrolled</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 font-medium">No active courses found.</p>
              )}
            </div>
          </div>


        </div>

        {/* Right Column: Fee Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CreditCard className="text-green-600" size={20} /> Fee Overview
          </h3>
          
          <div className="space-y-5">
             {/* Total Paid */}
             <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-1">
                   <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Total Paid</p>
                   <CheckCircle2 className="text-green-500" size={16} />
                </div>
                <p className="text-2xl font-bold text-green-700">Rs. {data.totalPaid}</p>
             </div>

             {/* Total Remaining */}
             <div className="p-5 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center justify-between mb-1">
                   <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Total Remaining</p>
                   <AlertCircle className="text-red-500" size={16} />
                </div>
                <p className="text-2xl font-bold text-red-700">Rs. {data.totalRemaining}</p>
                {data.totalRemaining > 0 && (
                   <p className="text-[10px] text-red-500 mt-2 font-bold uppercase">Please clear your dues</p>
                )}
             </div>

             {/* Monthly Fee Schedule */}
             <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <Calendar size={16} className="text-gray-400" /> Monthly Schedule
                </h4>
                
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                   {data.feeSchedule && data.feeSchedule.length > 0 ? (
                      data.feeSchedule.map((fee, idx) => (
                         <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-gray-50">
                            <span className="text-sm font-bold text-gray-700">{fee.month}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                               fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                               {fee.status}
                            </span>
                         </div>
                      ))
                   ) : (
                      <p className="text-xs text-gray-500 font-medium text-center">No fee records found.</p>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;