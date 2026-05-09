const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  
  fatherName: { 
    type: String, 
    required: true 
  },
  
  dob: { 
    type: Date, 
    required: true 
  },
  
  qualification: { type: String },

  cnic: { 
    type: Number, 
    required: true 
  },
  
  address: { 
    type: String, 
    required: true 
  },
  
  whatsapp: { 
    type: Number, 
    required: true 
  },
  course: { type: String, required: true },
  timing: { type: String, required: true },
  message: { type: String },
  photo: { type: String }, // Path to the uploaded image
  status: {
    type: String,
    enum: ['Enrolled', 'Not enrolled', 'Dropout', 'Passout'],
    default: 'Not Enrolled'
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Student', studentSchema);
