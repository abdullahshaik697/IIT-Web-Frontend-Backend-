import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Shield, 
  Key, 
  Camera, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const PersonalDetails = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [passUpdating, setPassUpdating] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    fatherName: '',
    whatsapp: '',
    address: '',
    qualification: '',
    dob: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('http://localhost:5000/api/user-portal/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStudent(data.student);
        setProfileForm({
          name: data.student.name || '',
          fatherName: data.student.fatherName || '',
          whatsapp: data.student.whatsapp || '',
          address: data.student.address || '',
          qualification: data.student.qualification || '',
          dob: data.student.dob ? new Date(data.student.dob).toISOString().split('T')[0] : ''
        });
        if (data.student.photo) {
            setPreview(`http://localhost:5000/${data.student.photo}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    Object.keys(profileForm).forEach(key => {
        formData.append(key, profileForm[key]);
    });
    if (photo) formData.append('photo', photo);

    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('http://localhost:5000/api/user-portal/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setStudent(data.student);
        localStorage.setItem('studentName', data.student.name);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Update failed.' });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords match error.' });
        return;
    }

    setPassUpdating(true);
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('http://localhost:5000/api/user-portal/change-password', {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Password updated!' });
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Password change failed.' });
    } finally {
      setPassUpdating(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium tracking-tight">Loading records...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 font-outfit pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Personal Details</h1>
        <p className="text-gray-500 text-sm mt-1">Update your profile and security credentials.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border animate-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
           {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
           <p className="font-bold text-xs">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer">
                 <div className="w-28 h-28 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-md">
                    {preview ? (
                        <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={40}/></div>
                    )}
                 </div>
                 <label className="absolute bottom-1 right-1 w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-green-700 transition">
                    <Camera size={14} />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                 </label>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mt-5">{student?.name}</h3>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{student?.course}</p>
              
              <div className="w-full mt-8 space-y-2">
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-left border border-gray-100">
                    <Shield className="text-gray-400" size={16} />
                    <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">CNIC</p>
                       <p className="text-xs font-bold text-gray-700">{student?.cnic}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-left border border-gray-100">
                    <Mail className="text-gray-400" size={16} />
                    <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                       <p className="text-xs font-bold text-gray-700">{student?.email}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <User className="text-green-600" size={18} /> Basic Information
              </h3>
              <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-0.5">Full Name</label>
                    <input 
                      type="text" 
                      value={profileForm.name} 
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700 text-sm"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-0.5">Father's Name</label>
                    <input 
                      type="text" 
                      value={profileForm.fatherName} 
                      onChange={(e) => setProfileForm({...profileForm, fatherName: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700 text-sm"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-0.5">WhatsApp</label>
                    <input 
                      type="number" 
                      value={profileForm.whatsapp} 
                      onChange={(e) => setProfileForm({...profileForm, whatsapp: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700 text-sm"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-0.5">Qualification</label>
                    <input 
                      type="text" 
                      value={profileForm.qualification} 
                      onChange={(e) => setProfileForm({...profileForm, qualification: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700 text-sm"
                    />
                 </div>
                 <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-0.5">Address</label>
                    <textarea 
                      value={profileForm.address} 
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700 text-sm"
                      rows="2"
                    />
                 </div>
                 <div className="md:col-span-2">
                    <button 
                      type="submit" 
                      disabled={updating}
                      className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-sm disabled:opacity-50"
                    >
                       {updating ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                    </button>
                 </div>
              </form>
           </div>

           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <Key className="text-red-500" size={18} /> Security Settings
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-gray-400 uppercase ml-0.5">Current Password</label>
                       <input 
                         type="password" 
                         required
                         value={passwordForm.oldPassword}
                         onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                         className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-gray-700 text-sm"
                       />
                    </div>
                    <div></div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-gray-400 uppercase ml-0.5">New Password</label>
                       <input 
                         type="password" 
                         required
                         value={passwordForm.newPassword}
                         onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                         className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700 text-sm"
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-gray-400 uppercase ml-0.5">Confirm Password</label>
                       <input 
                         type="password" 
                         required
                         value={passwordForm.confirmPassword}
                         onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                         className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700 text-sm"
                       />
                    </div>
                 </div>
                 <button 
                   type="submit" 
                   disabled={passUpdating}
                   className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition disabled:opacity-50"
                 >
                    {passUpdating ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
