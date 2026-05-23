import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Receipt, 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Printer, 
  User, 
  Calendar,
  XCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';

const FeeChallanGenerator = () => {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7), // Format: YYYY-MM
    status: 'Unpaid'
  });

  const [selectedStudentInfo, setSelectedStudentInfo] = useState(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

  const handleDownloadPDF = (fee) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Outer border (thin green line)
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner border (thick green line)
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(1.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Header / Brand Name
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(22, 163, 74);
    doc.text("INSTITUTE OF INFORMATION TECHNOLOGY (IIT)", 20, 25);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text("Professional IT Training Institute & Development Center", 20, 30);

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 35, pageWidth - 20, 35);

    // Challan Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(17, 24, 39);
    doc.text("FEE CHALLAN / RECEIPT", pageWidth / 2, 50, { align: 'center' });

    // Challan Info Grid (box)
    doc.setDrawColor(219, 234, 254);
    doc.setFillColor(243, 248, 255);
    doc.rect(20, 60, pageWidth - 40, 45, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);

    // Challan No.
    doc.text("CHALLAN NO:", 25, 70);
    doc.setFont('Courier', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(22, 163, 74);
    doc.text(fee.challanNo, 60, 70);

    // Month / Year
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text("BILLING MONTH:", 25, 80);
    doc.setFont('Helvetica', 'bold');
    doc.text(fee.month, 60, 80);

    // Date Generated
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text("ISSUE DATE:", 25, 90);
    const issueDateFormatted = fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : new Date().toLocaleDateString();
    doc.setFont('Helvetica', 'normal');
    doc.text(issueDateFormatted, 60, 90);

    // Status
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text("PAYMENT STATUS:", pageWidth - 90, 70);
    doc.setFont('Helvetica', 'bold');
    if (fee.status === 'Paid') {
      doc.setTextColor(22, 163, 74); // green
    } else {
      doc.setTextColor(220, 38, 38); // red
    }
    doc.text(fee.status.toUpperCase(), pageWidth - 50, 70);

    // Course
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text("ENROLLED COURSE:", pageWidth - 90, 80);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text(fee.courseName, pageWidth - 50, 80);

    // Student Info Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(22, 163, 74);
    doc.text("STUDENT DETAILS", 20, 120);

    // Student Details Table-like Layout
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 125, pageWidth - 20, 125);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text("Student Name:", 25, 135);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(fee.studentName, 60, 135);

    doc.line(20, 142, pageWidth - 20, 142);

    // Fees details table
    doc.setFillColor(249, 250, 251);
    doc.rect(20, 160, pageWidth - 40, 12, 'F');
    
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text("Description", 25, 168);
    doc.text("Amount (Rs.)", pageWidth - 50, 168);

    doc.line(20, 172, pageWidth - 20, 172);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text(`Tuition Fees for the month of ${fee.month}`, 25, 185);
    doc.setFont('Helvetica', 'bold');
    doc.text(`Rs. ${fee.amount}`, pageWidth - 50, 185);

    doc.line(20, 195, pageWidth - 20, 195);

    // Total
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(22, 163, 74);
    doc.text("TOTAL AMOUNT:", 25, 208);
    doc.text(`Rs. ${fee.amount}`, pageWidth - 50, 208);

    // Instructions
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.text("Terms & Payment Rules:", 20, 235);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text("1. Fees must be submitted before the 10th of every month.", 20, 242);
    doc.text("2. Please keep this receipt safe as proof of payment.", 20, 247);
    doc.text("3. Fees once paid are strictly non-refundable and non-transferable.", 20, 252);

    // Signatures
    doc.setDrawColor(156, 163, 175);
    doc.line(25, 275, 75, 275);
    doc.text("Student Signature", 37, 280);

    doc.line(pageWidth - 75, 275, pageWidth - 25, 275);
    doc.text("Authorized Signature", pageWidth - 65, 280);

    doc.save(`FeeChallan_${fee.challanNo}.pdf`);
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

  const fetchFees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/fees');
      const data = await response.json();
      if (data.success) {
        setFees(data.fees);
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
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
        amount: ''
      });
    } else {
      setSelectedStudentInfo(null);
    }
  };

  const formatMonthForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedMonth = formatMonthForDisplay(formData.month);
      const response = await fetch('http://localhost:5000/api/admin/fees/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          month: formattedMonth
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setShowForm(false);
        fetchFees();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error generating challan:', error);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    try {
      const response = await fetch(`http://localhost:5000/api/admin/fees/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchFees();
      }
    } catch (error) {
      console.error('Error updating fee status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this challan record?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/fees/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchFees();
      }
    } catch (error) {
      console.error('Error deleting fee record:', error);
    }
  };

  const filteredFees = fees.filter(fee => 
    (fee.studentName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (fee.challanNo?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-roboto animate-in fade-in duration-500">
      {/* Page Header - Clean & Professional */}
      <div className="bg-white -mx-8 -mt-8 px-8 py-6 border-b border-gray-100 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-[1600px] mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Receipt size={24} />
              </div>
              Fee Challan Generator
            </h1>
            <p className="text-gray-500 text-sm mt-1 ml-11">Manage student fee collections and generate monthly challans.</p>
          </div>
          <button 
            onClick={() => {
              setStudentSearchQuery('');
              setShowSearchResults(false);
              setSelectedStudentInfo(null);
              setFormData({
                studentId: '',
                amount: '',
                month: new Date().toISOString().slice(0, 7),
                status: 'Unpaid'
              });
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={18} /> Generate New Challan
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Receipt size={24} />
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Records</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{fees.length}</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <CheckCircle size={24} />
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paid Collections</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{fees.filter(f => f.status === 'Paid').length}</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <Clock size={24} />
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Dues</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{fees.filter(f => f.status === 'Unpaid').length}</p>
           </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student name or challan number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"
            />
          </div>
        </div>

        {/* Fees Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Challan No</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Student Info</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Billing Period</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 font-medium">Loading records...</td></tr>
                ) : filteredFees.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 font-medium">No fee records found.</td></tr>
                ) : (
                  filteredFees.map((fee) => (
                    <tr key={fee._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-xs uppercase tracking-tight border border-blue-100">
                          {fee.challanNo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                               <User size={18} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-gray-800">{fee.studentName}</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{fee.courseName}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" /> {fee.month}
                         </p>
                         <p className="text-xs font-bold text-blue-600 mt-0.5">Rs. {fee.amount}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <button 
                           onClick={() => handleStatusToggle(fee._id, fee.status)}
                           className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all duration-300 border ${
                             fee.status === 'Paid' 
                             ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                             : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                           }`}
                         >
                           {fee.status}
                         </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleDownloadPDF(fee)}
                              className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition" 
                              title="Print Receipt"
                            >
                               <Printer size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(fee._id)}
                              className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition" 
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
      </div>

      {/* Generator Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-[2rem] max-w-lg w-full p-10 shadow-2xl animate-in zoom-in duration-300 border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30">
                       <Receipt size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold text-gray-800">New Challan</h2>
                       <p className="text-gray-400 text-sm">Issue a fresh fee invoice</p>
                    </div>
                 </div>
                 <button onClick={() => setShowForm(false)} className="text-gray-300 hover:text-gray-600 transition p-2 hover:bg-gray-50 rounded-full">
                    <XCircle size={28} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="space-y-6">
                    <div className="space-y-2 relative">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Search & Select Student</label>
                       <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="text"
                            placeholder="Search student by Name, CNIC, or Course..."
                            value={studentSearchQuery}
                            onChange={(e) => {
                              setStudentSearchQuery(e.target.value);
                              setShowSearchResults(true);
                            }}
                            onFocus={() => setShowSearchResults(true)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold text-gray-700 transition"
                          />
                       </div>

                       {/* Search Results Dropdown List */}
                       {showSearchResults && studentSearchQuery.trim() !== '' && (
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-50 divide-y divide-gray-50">
                             {students
                               .filter(s => 
                                  (s.name?.toLowerCase() || "").includes(studentSearchQuery.toLowerCase()) ||
                                  (s.course?.toLowerCase() || "").includes(studentSearchQuery.toLowerCase()) ||
                                  String(s.cnic).includes(studentSearchQuery)
                               )
                               .slice(0, 10)
                               .map(s => (
                                  <div 
                                    key={s._id}
                                    onClick={() => {
                                       handleStudentSelect(s._id);
                                       setStudentSearchQuery(`${s.name} (${s.course})`);
                                       setShowSearchResults(false);
                                    }}
                                    className="p-4 hover:bg-blue-50/50 cursor-pointer flex justify-between items-center transition"
                                  >
                                     <div>
                                        <p className="text-sm font-bold text-gray-800">{s.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{s.course}</p>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-xs font-mono font-bold text-gray-500">CNIC: {s.cnic}</p>
                                     </div>
                                  </div>
                               ))
                             }
                             {students.filter(s => 
                                (s.name?.toLowerCase() || "").includes(studentSearchQuery.toLowerCase()) ||
                                (s.course?.toLowerCase() || "").includes(studentSearchQuery.toLowerCase()) ||
                                String(s.cnic).includes(studentSearchQuery)
                             ).length === 0 && (
                                <div className="p-4 text-center text-xs text-gray-400 font-medium">
                                   No student matches your search.
                                </div>
                             )}
                          </div>
                       )}
                       <input type="hidden" required value={formData.studentId} />
                    </div>

                    {selectedStudentInfo && (
                       <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm">
                             <User size={24} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-800">{selectedStudentInfo.name}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{selectedStudentInfo.course}</p>
                          </div>
                          <div className="ml-auto p-2 bg-white rounded-xl">
                             <ArrowUpRight size={18} className="text-blue-600" />
                          </div>
                       </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Fee Amount (Rs.)</label>
                          <input 
                            type="number" 
                            required
                            placeholder="e.g. 5000"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold text-gray-700 transition"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Select Month</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="month" 
                                required
                                value={formData.month}
                                onChange={(e) => setFormData({...formData, month: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold text-gray-700 transition"
                            />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Payment Status</label>
                       <div className="flex gap-4">
                          {['Unpaid', 'Paid'].map(s => (
                             <label key={s} className="flex-1 cursor-pointer group">
                                <input 
                                  type="radio" 
                                  name="status" 
                                  value={s}
                                  checked={formData.status === s}
                                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                                  className="hidden" 
                                />
                                <div className={`py-3 text-center rounded-2xl font-bold text-sm transition-all duration-300 border-2 ${
                                  formData.status === s 
                                    ? (s === 'Paid' ? 'bg-green-50 border-green-500 text-green-700 shadow-lg shadow-green-200' : 'bg-red-50 border-red-500 text-red-700 shadow-lg shadow-red-200') 
                                    : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200'
                                }`}>
                                   {s}
                                </div>
                             </label>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition active:scale-95"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!formData.studentId}
                      className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-600/30 active:scale-95 disabled:opacity-50"
                    >
                       Generate & Issue
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default FeeChallanGenerator;
