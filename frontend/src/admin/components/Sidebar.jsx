import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  BookOpen,
  FileBadge, 
  ReceiptText, 
  Search, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { path: '/admin/admissions', icon: UserPlus, label: 'Admissions' },
    { path: '/admin/enrolled', icon: Users, label: 'Enrolled' },
    { path: '/admin/certificates', icon: FileBadge, label: 'Certificates' },
    { path: '/admin/fees', icon: ReceiptText, label: 'Fee Challan' },
    { path: '/admin/verify-fee', icon: Search, label: 'Verify Fee' },
  ];

  const handleLogout = () => {
    // Logic for logout
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-green-500">IIT ADMIN</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive 
                ? 'bg-green-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full rounded-lg text-red-400 hover:bg-gray-800 transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
