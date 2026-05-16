import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const UserPortalLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const studentName = localStorage.getItem('studentName') || 'Student';

  return (
    <div className="min-h-screen bg-gray-50 flex font-outfit">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Matching Admin Header Style */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <button 
            className="p-2 lg:hidden text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="text-right hidden sm:block">
               <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Welcome,</p>
               <p className="text-sm font-bold text-gray-800">{studentName}</p>
             </div>
             <div className="h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-sm">
               {studentName.charAt(0)}
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserPortalLayout;
