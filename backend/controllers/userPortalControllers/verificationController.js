const Fee = require('../../model/Fee');
const Certificate = require('../../model/Certificate');
const Student = require('../../model/Student');

// GET all fees for the student
const getFeeHistory = async (req, res) => {
    try {
        const studentId = req.student.id;
        const fees = await Fee.find({ studentId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, fees });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error fetching fee history" });
    }
};

// Search Specific Challan
const searchChallan = async (req, res) => {
    try {
        const { challanNo } = req.params;
        const studentId = req.student.id;
        
        // Find fee that matches both challanNo and the studentId (so they can't see others)
        const fee = await Fee.findOne({ challanNo, studentId });
        
        if (!fee) {
            return res.status(404).json({ success: false, message: "Challan not found" });
        }
        
        res.status(200).json({ success: true, fee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error searching challan" });
    }
};

// Verify Certificate
const verifyCertificate = async (req, res) => {
    try {
        const { certificateNo } = req.params;
        
        // Populate student info to show details
        const certificate = await Certificate.findOne({ certificateNo })
            .populate('studentId', 'name fatherName photo');

        if (!certificate) {
            return res.status(404).json({ success: false, message: "Certificate is invalid or not found." });
        }

        res.status(200).json({ 
            success: true, 
            certificate: {
                certificateNo: certificate.certificateNo,
                studentName: certificate.studentId.name,
                fatherName: certificate.studentId.fatherName,
                course: certificate.course,
                issueDate: certificate.issueDate,
                duration: certificate.duration,
                photo: certificate.studentId.photo,
                status: 'Valid'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error verifying certificate" });
    }
};

module.exports = {
    getFeeHistory,
    searchChallan,
    verifyCertificate
};
