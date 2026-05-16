const Student = require('../../model/Student');
const Fee = require('../../model/Fee');
const Certificate = require('../../model/Certificate');

const getDashboardStats = async (req, res) => {
    try {
        const studentId = req.student.id;

        // 1. Get Student Info
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // 2. Courses Stats
        // For now, students are enrolled in one main course. 
        // We can count the main course as 1.
        const totalCourses = 1; 

        // 3. Fees Stats
        const fees = await Fee.find({ studentId });
        const totalPaid = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
        const totalRemaining = fees.filter(f => f.status === 'Unpaid' || f.status === 'Partial').reduce((sum, f) => sum + f.amount, 0);

        // 4. Certificates Stats
        const certificates = await Certificate.find({ studentId });
        const certificatesEarned = certificates.length;

        // 5. Notifications (Placeholders)
        const notifications = [
            { id: 1, type: 'fee', message: 'Monthly fee for June is due.', date: '2026-06-01' },
            { id: 2, type: 'event', message: 'Upcoming workshop on MERN Stack.', date: '2026-05-20' }
        ];

        // 6. Course Progress (Placeholder)
        const courseProgress = [
            { courseName: student.course, progress: 45 }
        ];

        res.status(200).json({
            success: true,
            stats: {
                studentName: student.name,
                totalCourses,
                totalPaid,
                totalRemaining,
                certificatesEarned,
                notifications,
                courseProgress
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error fetching dashboard stats" });
    }
};

module.exports = { getDashboardStats };
