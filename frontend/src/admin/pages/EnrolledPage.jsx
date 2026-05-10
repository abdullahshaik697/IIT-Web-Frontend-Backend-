import { useState, useEffect } from 'react';
import { Edit2, XCircle, Search, Eye, Save } from 'lucide-react';

const EnrolledPage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchEnrolledStudents();
    fetchCourses();
  }, []);

  const fetchEnrolledStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/enrolled');
      const data = await response.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEditForm({ ...student });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/admin/enrolled/${editForm._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();
      if (data.success) {
        alert('Student record updated successfully');
        setIsEditing(false);
        setShowModal(false);
        fetchEnrolledStudents();
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Enrolled': return 'bg-green-100 text-green-700';
      case 'Passout': return 'bg-blue-100 text-blue-700';
      case 'Dropout': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.cnic.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Enrolled Students</h1>
          <p className="text-gray-500 text-sm">Manage enrolled, passout, and dropout students</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or CNIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64 transition"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Student Info</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Course</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading students...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No students found.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden border">
                          {student.photo ? (
                            <img src={`http://localhost:5000/${student.photo}`} alt={student.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold">
                              {student.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-500">CNIC: {student.cnic}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">{student.course}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{student.whatsapp}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedStudent(student); setIsEditing(false); setShowModal(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditClick(student)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                          title="Edit Status/Details"
                        >
                          <Edit2 size={18} />
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

      {/* Details/Edit Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? 'Edit Enrolled Student' : 'Student Record Details'}
              </h2>
              <button onClick={() => { setShowModal(false); setIsEditing(false); }} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="aspect-square w-full rounded-xl bg-gray-100 overflow-hidden border-2 border-gray-200">
                    {selectedStudent.photo ? (
                      <img src={`http://localhost:5000/${selectedStudent.photo}`} alt={selectedStudent.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300 text-5xl">👤</div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                    {isEditing ? (
                      <select 
                        value={editForm.status || ''}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className={`w-full border p-2 rounded-lg text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none ${getStatusColor(editForm.status)}`}
                      >
                        <option value="Enrolled">Enrolled</option>
                        <option value="Passout">Passout</option>
                        <option value="Dropout">Dropout</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(selectedStudent.status)}`}>
                        {selectedStudent.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: 'Full Name', name: 'name', type: 'text' },
                      { label: 'Father Name', name: 'fatherName', type: 'text' },
                      { label: 'CNIC', name: 'cnic', type: 'number' },
                      { label: 'WhatsApp', name: 'whatsapp', type: 'number' },
                      { label: 'Qualification', name: 'qualification', type: 'text' },
                    ].map((field) => (
                      <div key={field.name}>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{field.label}</p>
                        {isEditing ? (
                          <input
                            type={field.type}
                            value={editForm[field.name] || ''}
                            onChange={(e) => setEditForm({ ...editForm, [field.name]: e.target.value })}
                            className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                          />
                        ) : (
                          <p className="font-semibold text-gray-800">{selectedStudent[field.name]}</p>
                        )}
                      </div>
                    ))}
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Course</p>
                      {isEditing ? (
                        <select 
                          value={editForm.course || ''}
                          onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                          className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        >
                          <option value="">Select Course</option>
                          {courses.map(c => (
                            <option key={c._id} value={c.title}>{c.title}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="font-semibold text-gray-800">{selectedStudent.course}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    {isEditing ? (
                      <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                      >
                        <Save size={20} /> Save Changes
                      </button>
                    ) : (
                      <p className="text-xs text-gray-400 text-center italic">Use the edit button to update status or details</p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledPage;
