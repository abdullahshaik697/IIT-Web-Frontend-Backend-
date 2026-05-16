const Certificate = require('../../model/Certificate');
const Student = require('../../model/Student');
const Fee = require('../../model/Fee');
const Counter = require('../../model/Counter');

// Get all certificates
const getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find().sort({ issueDate: -1 });
        res.status(200).json({ success: true, certificates });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching certificates" });
    }
};

// Generate Certificate
const generateCertificate = async (req, res) => {
    try {
        const { studentId, course, duration, issueDate } = req.body;

        // 1. Check if Student is valid
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Check if student is a Dropout
        if (student.status === 'Dropout') {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot generate certificate for a student with 'Dropout' status." 
            });
        }

        // 2. CHECK FEES STATUS
        // Find if there are any unpaid fees for this student
        const unpaidFees = await Fee.findOne({ studentId, status: 'Unpaid' });
        if (unpaidFees) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot generate certificate. Student has unpaid fees (Challan No: " + unpaidFees.challanNo + ")." 
            });
        }

        // 3. Check if certificate already exists for this course
        const existing = await Certificate.findOne({ studentId, course });
        if (existing) {
            return res.status(400).json({ success: false, message: "Certificate already issued for this course." });
        }

        // 4. Generate Certificate No
        const counter = await Counter.findOneAndUpdate(
            { id: 'certificateNo' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const certificateNo = `CERT-${counter.seq}`;

        // 5. Create Certificate
        const newCertificate = new Certificate({
            certificateNo,
            studentId,
            studentName: student.name,
            fatherName: student.fatherName,
            course,
            duration,
            issueDate: issueDate || Date.now()
        });

        await newCertificate.save();

        // Optional: Update student status to Passout if it was Enrolled
        if (student.status === 'Enrolled') {
            await Student.findByIdAndUpdate(studentId, { status: 'Passout' });
        }

        res.status(201).json({
            success: true,
            message: "Certificate generated successfully!",
            certificate: newCertificate
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error generating certificate" });
    }
};

const deleteCertificate = async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Certificate deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting certificate" });
    }
};

module.exports = {
    getCertificates,
    generateCertificate,
    deleteCertificate
};
