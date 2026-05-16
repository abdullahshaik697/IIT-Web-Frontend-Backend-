const Fee = require('../../model/Fee');
const Student = require('../../model/Student');
const Counter = require('../../model/Counter');

// Get all fee records
const getAllFees = async (req, res) => {
    try {
        const fees = await Fee.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, fees });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching fees" });
    }
};

// Generate New Challan
const generateChallan = async (req, res) => {
    try {
        const { studentId, amount, month, status } = req.body;

        // 1. Check if Student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // 2. Check if challan for this month already exists
        const existing = await Fee.findOne({ studentId, month });
        if (existing) {
            return res.status(400).json({ success: false, message: `Challan for ${month} already exists for this student.` });
        }

        // 3. Generate Challan No
        const counter = await Counter.findOneAndUpdate(
            { id: 'challanNo' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const challanNo = `CH-${counter.seq}`;

        // 4. Create Fee record
        const newFee = new Fee({
            challanNo,
            studentId,
            studentName: student.name,
            courseName: student.course,
            amount,
            month,
            status: status || 'Unpaid',
            paidDate: status === 'Paid' ? Date.now() : null
        });

        await newFee.save();

        res.status(201).json({
            success: true,
            message: "Fee Challan generated successfully!",
            fee: newFee
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error generating challan" });
    }
};

// Update Fee Status (Paid/Unpaid)
const updateFeeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedFee = await Fee.findByIdAndUpdate(
            id, 
            { 
                status, 
                paidDate: status === 'Paid' ? Date.now() : null 
            }, 
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Challan marked as ${status}`,
            fee: updatedFee
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating fee status" });
    }
};

// Delete Challan
const deleteChallan = async (req, res) => {
    try {
        await Fee.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Challan deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting challan" });
    }
};

module.exports = {
    getAllFees,
    generateChallan,
    updateFeeStatus,
    deleteChallan
};
