const Student = require('../../model/Student');
const Certificate = require('../../model/Certificate');
const Fee = require('../../model/Fee');

// Get Dashboard Analytics and Finance
const getDashboardStats = async (req, res) => {
  try {
    const totalEnrollment = await Student.countDocuments();
    const totalPassout = await Student.countDocuments({ status: 'Passout' });
    const totalDropout = await Student.countDocuments({ status: 'Dropout' });
    const currentEnrollment = await Student.countDocuments({ status: 'Enrolled' });
    const totalCertificateIssued = await Certificate.countDocuments();

    // Course Distribution (Pie Chart)
    const courseDistribution = await Student.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } }
    ]);

    // Enrollment Trends (Line Chart - Last 6 Months)
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      last6Months.push(d.toLocaleString('default', { month: 'short' }));
    }

    // Dummy trends for now, in real app we'd aggregate by date
    const enrollmentTrends = [12, 19, 15, 25, 22, 30]; 

    // Revenue Trends (Bar Chart - Last 6 Months)
    const revenueTrends = [50000, 45000, 60000, 55000, 70000, 85000];

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' }) + " " + currentDate.getFullYear();
    
    const feesThisMonth = await Fee.find({ 
      month: currentMonth,
      status: 'Paid'
    });
    const thisMonthRevenue = feesThisMonth.reduce((acc, curr) => acc + curr.amount, 0);

    res.status(200).json({
      success: true,
      analytics: {
        totalEnrollment,
        totalPassout,
        totalDropout,
        currentEnrollment,
        totalCertificateIssued,
        courseDistribution: courseDistribution || [],
        enrollmentTrends: {
          labels: last6Months,
          data: enrollmentTrends
        }
      },
      finance: {
        thisMonthRevenue,
        revenueTrends: {
          labels: last6Months,
          data: revenueTrends
        },
        currentMonth
      }
    });
  } catch (error) {
    console.error("DASHBOARD_ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard stats",
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
