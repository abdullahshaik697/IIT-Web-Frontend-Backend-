import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  FileBadge, 
  TrendingUp 
} from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard');
      const data = await response.json();
      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading Dashboard...</div>
  }

  const statCards = [
    { label: 'Total Enrollment', value: stats.analytics.totalEnrollment, icon: Users, color: 'bg-blue-500' },
    { label: 'Current Enrollment', value: stats.analytics.currentEnrollment, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Total Passout', value: stats.analytics.totalPassout, icon: FileBadge, color: 'bg-indigo-500' },
    { label: 'Total Dropout', value: stats.analytics.totalDropout, icon: UserMinus, color: 'bg-red-500' },
    { label: 'Certificates Issued', value: stats.analytics.totalCertificateIssued, icon: FileBadge, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Administrator</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Finance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Revenue Analytics</h3>
            <TrendingUp className="text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">This Month ({stats.finance.currentMonth})</p>
                <p className="text-2xl font-bold">Rs. {stats.finance.thisMonthRevenue}</p>
              </div>
              <span className="text-green-500 font-medium">+12%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Previous Months</p>
                <p className="text-2xl font-bold">Rs. {stats.finance.previousMonthsRevenue}</p>
              </div>
              <span className="text-gray-400 font-medium">Stable</span>
            </div>
          </div>
        </div>

        {/* Placeholder for more charts/data */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center border-dashed">
          <p className="text-gray-400">Additional Analytics Chart Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
