const Student = require('../../model/Student');

// Get Student Profile
const getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id).select('-password');
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        res.status(200).json({ success: true, student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error fetching profile" });
    }
};

// Update Student Profile Details
const updateProfile = async (req, res) => {
    try {
        const { name, fatherName, dob, address, whatsapp, qualification } = req.body;
        const updateData = { name, fatherName, dob, address, whatsapp, qualification };

        if (req.file) {
            updateData.photo = req.file.path;
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.student.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            student: updatedStudent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error updating profile" });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const student = await Student.findById(req.student.id);

        if (!student.password) {
            // Handle case where password isn't set yet
            student.password = newPassword;
            await student.save();
            return res.status(200).json({ success: true, message: "Password set successfully" });
        }

        if (oldPassword !== student.password) {
            return res.status(400).json({ success: false, message: "Invalid old password" });
        }

        student.password = newPassword;
        await student.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error changing password" });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword
};
