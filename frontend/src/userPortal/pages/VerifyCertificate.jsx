import { useState } from 'react';
import { Search, Award, Download, CheckCircle2, XCircle, User, BookOpen, Calendar, ShieldCheck } from 'lucide-react';

const VerifyCertificate = () => {
  const [certNo, setCertNo] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certNo) return;
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/user-portal/verify-certificate/${certNo}`);
      const data = await response.json();
      if (data.success) {
        setResult(data.certificate);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 font-outfit">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-sm mb-6">
           <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Certificate Verification</h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto font-medium">Verify the authenticity of your professional certification.</p>
        
        <form onSubmit={handleVerify} className="max-w-md mx-auto mt-8 flex gap-2">
           <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Certificate No..." 
                value={certNo}
                onChange={(e) => setCertNo(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-bold text-gray-700 text-sm"
              />
           </div>
           <button 
             type="submit"
             disabled={loading}
             className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition active:scale-95 disabled:opacity-50 shadow-sm"
           >
             {loading ? '...' : 'Verify'}
           </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
           <XCircle className="text-red-500" size={20} />
           <p className="text-red-700 font-bold text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in zoom-in duration-500">
           <div className="bg-green-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <CheckCircle2 size={20} />
                 <div>
                    <h2 className="text-lg font-bold">Valid Certificate</h2>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Official Record Verified</p>
                 </div>
              </div>
              <Award size={32} className="opacity-30" />
           </div>

           <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="flex items-center gap-5">
                       <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                          {result.photo ? (
                             <img src={`http://localhost:5000/${result.photo}`} alt="Student" className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={32}/></div>
                          )}
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Holder</p>
                          <h3 className="text-xl font-bold text-gray-800 leading-tight">{result.studentName}</h3>
                          <p className="text-xs font-bold text-gray-500 mt-0.5">Father: {result.fatherName}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                             <BookOpen size={10}/> Course
                          </p>
                          <p className="font-bold text-gray-800 text-sm">{result.course}</p>
                       </div>
                       <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                             <Calendar size={10}/> Date
                          </p>
                          <p className="font-bold text-gray-800 text-sm">{new Date(result.issueDate).toLocaleDateString()}</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 flex flex-col justify-between">
                    <div className="bg-gray-900 rounded-2xl p-6 text-white relative">
                       <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2">Verification ID</p>
                       <h4 className="text-2xl font-bold font-mono tracking-tighter mb-2">{result.certificateNo}</h4>
                       <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                          <ShieldCheck size={14} className="text-green-500" />
                          Secure Record
                       </div>
                    </div>

                    <button className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-sm active:scale-95">
                       <Download size={18} /> Download PDF
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
