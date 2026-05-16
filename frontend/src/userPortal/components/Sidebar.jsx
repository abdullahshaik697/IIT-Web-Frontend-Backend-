import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, CreditCard, BookOpen, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const studentName = localStorage.getItem('studentName') || 'Student';

  const menuItems = [
    { title: 'Dashboard', path: '/userportal/dashboard', icon: LayoutDashboard },
    { title: 'My Courses', path: '/userportal/courses', icon: BookOpen },
    { title: 'Verify Certificate', path: '/userportal/verify-certificate', icon: ShieldCheck },
    { title: 'Verify Fees', path: '/userportal/verify-fees', icon: CreditCard },
    { title: 'Personal Details', path: '/userportal/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentName');
    navigate('/userportal/login');
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-800 flex items-center gap-3">
            <img src="/images/logo.png" alt="IIT Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-bold text-green-500">IIT STUDENT PORTAL</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition
                    ${isActive 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-800">
            <div className="p-3 bg-gray-800 rounded-lg mb-4">
               <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Student</p>
               <p className="text-sm font-bold text-gray-200 truncate">{studentName}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-gray-800 transition font-medium text-sm"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
