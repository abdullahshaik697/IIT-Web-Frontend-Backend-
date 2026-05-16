const Student = require('../../model/Student');
const jwt = require('jsonwebtoken');

// Student Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for student
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Check password (plain text as requested)
        if (student.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Create Token
        const token = jwt.sign(
            { id: student._id, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
};

module.exports = { login };
