const Student = require('../../model/Student');
const Course = require('../../model/Course');
const Fee = require('../../model/Fee');

const getMyCourses = async (req, res) => {
    try {
        const studentId = req.student.id;

        // 1. Get Student Info
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // 2. Get Detailed Course Info
        // Assuming student.course stores the course title
        const courseDetails = await Course.findOne({ title: student.course });

        // 3. Get Fee Status for this course
        // In this system, we can check if there are any unpaid fees for this student
        const unpaidFees = await Fee.findOne({ studentId, status: { $ne: 'Paid' } });
        const isFeePaid = !unpaidFees;

        // 4. Construct Course Object for Portal
        const courseData = {
            _id: student._id,
            title: student.course,
            description: courseDetails ? courseDetails.description : "No description available",
            image: courseDetails ? courseDetails.image : null,
            status: student.status, // Enrolled, Passout, Dropout
            progress: student.status === 'Passout' ? 100 : (student.status === 'Dropout' ? 0 : 45), // Placeholder logic
            isFeePaid: isFeePaid,
            enrolledAt: student.appliedAt
        };

        res.status(200).json({
            success: true,
            courses: [courseData] // Returning as array for future multiple courses support
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error fetching your courses" });
    }
};

const dropCourse = async (req, res) => {
    try {
        const studentId = req.student.id;
        await Student.findByIdAndUpdate(studentId, { status: 'Dropout' });
        res.status(200).json({ success: true, message: "Course dropped successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error dropping course" });
    }
};

module.exports = { getMyCourses, dropCourse };
