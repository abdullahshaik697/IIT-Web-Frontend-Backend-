import { useState, useEffect } from 'react';
import { Users, GraduationCap, UserX, Award, DollarSign, TrendingUp } from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title 
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Failed to load statistics.</div>;

  const { analytics, finance } = stats;

  // Bar Chart Data: Course Distribution
  const courseBarData = {
    labels: analytics.courseDistribution.map(c => c._id || 'Unassigned'),
    datasets: [
      {
        label: 'Students Enrolled',
        data: analytics.courseDistribution.map(c => c.count),
        backgroundColor: 'rgba(168, 85, 247, 0.7)', // Purple
        borderRadius: 8,
      },
    ],
  };

  // Pie Chart Data: Student Status
  const statusPieData = {
    labels: ['Enrolled', 'Passout', 'Dropout'],
    datasets: [
      {
        data: [analytics.currentEnrollment, analytics.totalPassout, analytics.totalDropout],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',  // Green
          'rgba(59, 130, 246, 0.7)',  // Blue
          'rgba(239, 68, 68, 0.7)',   // Red
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  // Line Chart Data: Enrollment Trends
  const lineData = {
    labels: analytics.enrollmentTrends.labels,
    datasets: [
      {
        label: 'Monthly Admissions',
        data: analytics.enrollmentTrends.data,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Bar Chart Data: Revenue Trends
  const barData = {
    labels: finance.revenueTrends.labels,
    datasets: [
      {
        label: 'Revenue (PKR)',
        data: finance.revenueTrends.data,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 12 } } },
    },
  };

  const cards = [
    { title: 'Total Enrollment', value: analytics.totalEnrollment, icon: Users, color: 'bg-blue-500' },
    { title: 'Current Enrollment', value: analytics.currentEnrollment, icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Total Passout', value: analytics.totalPassout, icon: GraduationCap, color: 'bg-purple-500' },
    { title: 'Total Dropout', value: analytics.totalDropout, icon: UserX, color: 'bg-red-500' },
    { title: 'Certificates Issued', value: analytics.totalCertificateIssued, icon: Award, color: 'bg-orange-500' },
    { title: 'Month Revenue', value: `Rs. ${finance.thisMonthRevenue}`, icon: DollarSign, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of Institute Analytics & Performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-white mb-4`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{card.title}</p>
              <h3 className="text-xl font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart: Enrollment Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Enrollment Trends</h3>
          <div className="h-80">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Bar Chart: Revenue Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Overview</h3>
          <div className="h-80">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Bar Chart: Course Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Course Enrollment Distribution</h3>
          <div className="h-80">
            <Bar data={courseBarData} options={chartOptions} />
          </div>
        </div>

        {/* Pie Chart: Student Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Student Status Distribution</h3>
          <div className="h-80">
            <Pie data={statusPieData} options={chartOptions} />
          </div>
        </div>

        {/* Quick Insights Box */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-lg text-white flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-4">Quick Insights</h3>
          <ul className="space-y-4 text-green-50">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>The most popular course is <strong>{analytics.courseDistribution?.length > 0 ? [...analytics.courseDistribution].sort((a,b)=>b.count-a.count)[0]?._id : 'N/A'}</strong></span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Student retention rate is positive with only <strong>{analytics.totalDropout}</strong> dropouts.</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Revenue this month is <strong>Rs. {finance.thisMonthRevenue}</strong>.</span>
            </li>
          </ul>
          <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
             <p className="text-sm">Keep up the good work! The institute is growing steadily.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
