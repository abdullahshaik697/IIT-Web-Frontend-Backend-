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
        totalCertificateIssued
      },
      finance: {
        thisMonthRevenue,
        previousMonthsRevenue: 0,
        currentMonth
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard stats"
    });
  }
};

module.exports = {
  getDashboardStats
};
