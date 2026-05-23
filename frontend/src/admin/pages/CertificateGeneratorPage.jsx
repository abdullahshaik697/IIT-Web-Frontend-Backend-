import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Award, 
  Search, 
  Plus, 
  Trash2, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Printer, 
  User, 
  Calendar,
  XCircle
} from 'lucide-react';

const CertificateGeneratorPage = () => {
  const [students, setStudents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    studentId: '',
    course: '',
    duration: '',
    issueDate: new Date().toISOString().split('T')[0]
  });

  const [selectedStudentInfo, setSelectedStudentInfo] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchCertificates();
  }, []);

  const handleDownloadPDF = (cert) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;

    // --- DRAW DECORATIVE BORDERS ---
    // Outer border (thin green line)
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Inner border (thick green line)
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(2);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Corner elegant line decorations
    doc.setLineWidth(0.5);
    doc.line(12, 12, 25, 12);
    doc.line(12, 12, 12, 25);

    doc.line(pageWidth - 12, 12, pageWidth - 25, 12);
    doc.line(pageWidth - 12, 12, pageWidth - 12, 25);

    doc.line(12, pageHeight - 12, 25, pageHeight - 12);
    doc.line(12, pageHeight - 12, 12, pageHeight - 25);

    doc.line(pageWidth - 12, pageHeight - 12, pageWidth - 25, pageHeight - 12);
    doc.line(pageWidth - 12, pageHeight - 12, pageWidth - 12, pageHeight - 25);

    // --- TOP LEFT: Certificate No. ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(`Certificate No: ${cert.certificateNo}`, 16, 20);

    // --- TOP RIGHT: Institute Name ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(22, 163, 74);
    doc.text("Institute of Information Technology (IIT)", pageWidth - 16, 20, { align: 'right' });

    // --- TITLE: Certificate of Completion ---
    doc.setFont('Times', 'italic');
    doc.setFontSize(36);
    doc.setTextColor(17, 24, 39);
    doc.text("Certificate of Completion", pageWidth / 2, 55, { align: 'center' });

    // Elegant dividing line under title
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 40, 62, pageWidth / 2 + 40, 62);

    // Subtitle
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text("This is proudly presented to", pageWidth / 2, 75, { align: 'center' });

    // --- CENTER: Student Name ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(22, 163, 74);
    doc.text(cert.studentName, pageWidth / 2, 92, { align: 'center' });

    // --- CENTER: Father's Name ---
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(75, 85, 99);
    doc.text(`S/O / D/O  ${cert.fatherName}`, pageWidth / 2, 105, { align: 'center' });

    // Description text
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text(`for successfully completing the course of study in`, pageWidth / 2, 120, { align: 'center' });

    // --- CENTER: Course Title ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(17, 24, 39);
    doc.text(cert.course, pageWidth / 2, 134, { align: 'center' });

    // --- CENTER: Duration (from - to) ---
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    doc.text(`Duration: ${cert.duration}`, pageWidth / 2, 146, { align: 'center' });

    // --- BOTTOM LEFT: Date of Issue ---
    const issueDateFormatted = new Date(cert.issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Date of Issue: ${issueDateFormatted}`, 20, pageHeight - 30);
    doc.line(20, pageHeight - 26, 80, pageHeight - 26);

    // --- BOTTOM RIGHT: Signature & Name of Head ---
    doc.setFont('Times', 'italic');
    doc.setFontSize(16);
    doc.setTextColor(22, 163, 74);
    doc.text("Rafique Bhutto", pageWidth - 50, pageHeight - 32, { align: 'center' });

    doc.setDrawColor(156, 163, 175);
    doc.setLineWidth(0.5);
    doc.line(pageWidth - 80, pageHeight - 26, pageWidth - 20, pageHeight - 26);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text("Rafique Bhutto", pageWidth - 50, pageHeight - 21, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text("Head of Institute", pageWidth - 50, pageHeight - 16, { align: 'center' });

    doc.save(`Certificate_${cert.certificateNo}.pdf`);
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/enrolled');
      const data = await response.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/certificates');
      const data = await response.json();
      if (data.success) {
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (studentId) => {
    const student = students.find(s => s._id === studentId);
    if (student) {
      setSelectedStudentInfo(student);
      setFormData({
        ...formData,
        studentId: studentId,
        course: student.course,
        duration: '3 Months' // Default or extracted
      });
    } else {
      setSelectedStudentInfo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setShowForm(false);
        fetchCertificates();
        fetchStudents(); // Refresh student statuses
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate record?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/certificates/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchCertificates();
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const filteredCertificates = certificates.filter(cert => 
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-roboto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-green-600" /> Certificate Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Generate and verify student professional certificates.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-green-600/20"
        >
          <Plus size={18} /> New Certificate
        </button>
      </div>

      {/* Stats/Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by student name or certificate number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
        <div className="hidden md:flex items-center gap-6 px-4 border-l border-gray-100">
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Issued</p>
              <p className="text-lg font-bold text-gray-800">{certificates.length}</p>
           </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Cert No</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Issue Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading records...</td></tr>
              ) : filteredCertificates.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No certificates found.</td></tr>
              ) : (
                filteredCertificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-green-700 text-sm">{cert.certificateNo}</td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                             <User size={16} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-800">{cert.studentName}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase">{cert.fatherName}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{cert.course}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(cert.issueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                           <button 
                             onClick={() => handleDownloadPDF(cert)}
                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                             title="Print/Download"
                           >
                              <Printer size={18} />
                           </button>
                          <button 
                            onClick={() => handleDelete(cert._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" 
                            title="Delete"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generator Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Award className="text-green-600" /> New Certificate Issuance
                 </h2>
                 <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition">
                    <XCircle size={24} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Student</label>
                       <select 
                         required
                         value={formData.studentId}
                         onChange={(e) => handleStudentSelect(e.target.value)}
                         className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700"
                       >
                          <option value="">Choose an Enrolled student...</option>
                          {students.filter(s => s.status !== 'Dropout').map(s => (
                             <option key={s._id} value={s._id}>{s.name} ({s.course}) - {s.status}</option>
                          ))}
                       </select>
                    </div>

                    {selectedStudentInfo && (
                       <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 border border-green-100">
                                <User size={20} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-gray-800">{selectedStudentInfo.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{selectedStudentInfo.course}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Fee Verification</span>
                             <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                <CheckCircle size={14} /> Clear to Issue
                             </div>
                          </div>
                       </div>
                    )}

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Course Title</label>
                       <input 
                         type="text" 
                         required
                         readOnly
                         value={formData.course}
                         className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xl font-bold text-gray-600"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration (from - to)</label>
                       <input 
                         type="text" 
                         required
                         value={formData.duration}
                         onChange={(e) => setFormData({...formData, duration: e.target.value})}
                         placeholder="e.g. Jan 2026 - Mar 2026"
                         className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issue Date</label>
                       <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            type="date" 
                            required
                            value={formData.issueDate}
                            onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!formData.studentId}
                      className="flex-[2] py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20 disabled:opacity-50"
                    >
                       Generate & Issue Certificate
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGeneratorPage;
