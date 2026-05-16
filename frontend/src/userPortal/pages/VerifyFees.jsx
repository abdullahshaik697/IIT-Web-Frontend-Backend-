import { useState, useEffect } from 'react';
import { Search, CreditCard, Download, Clock, CheckCircle2, Calendar } from 'lucide-react';

const VerifyFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchFeeHistory();
  }, []);

  const fetchFeeHistory = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('http://localhost:5000/api/user-portal/fee-history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`http://localhost:5000/api/user-portal/search-challan/${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSearchResult(data.fee);
      } else {
        alert('Challan not found.');
      }
    } catch (error) {
      console.error('Error searching challan:', error);
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading records...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-outfit">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Verification</h1>
          <p className="text-gray-500 text-sm mt-1">Search and view your payment history.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Challan No..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 w-48 text-sm shadow-sm"
              />
           </div>
           <button 
             type="submit"
             disabled={searching}
             className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-black transition active:scale-95 disabled:opacity-50 shadow-sm"
           >
             {searching ? '...' : 'Search'}
           </button>
        </form>
      </div>

      {searchResult && (
        <div className="bg-green-600 rounded-2xl p-6 text-white shadow-md animate-in zoom-in duration-300">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">Challan Details</p>
                 <h2 className="text-2xl font-bold">{searchResult.challanNo}</h2>
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">Amount Status</p>
                 <p className="text-xl font-bold">Rs. {searchResult.amount} ({searchResult.status})</p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                 <button className="flex items-center gap-2 text-xs font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition border border-white/20">
                    <Download size={14} /> Download Receipt
                 </button>
                 <button onClick={() => setSearchResult(null)} className="text-[10px] uppercase font-bold opacity-70 hover:opacity-100">Clear Search</button>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
           <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Payment Ledger</h3>
           <CreditCard className="text-gray-400" size={18} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Challan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fees.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-6 py-10 text-center text-gray-400 font-medium">No history available.</td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-gray-50/30 transition">
                    <td className="px-6 py-4 font-bold text-gray-700 text-sm">{fee.challanNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{fee.course}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">Rs. {fee.amount}</td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${fee.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {fee.status === 'Paid' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                          {fee.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-gray-400 hover:text-green-600 transition">
                          <Download size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VerifyFees;
