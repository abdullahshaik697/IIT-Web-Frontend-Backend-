import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Info,
  BookOpen,
  FileText,
  CheckCircle,
  Star,
  Calendar,
  Heart,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About Us", href: "/about", icon: Info },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: " OnlineAdmission", href: "/admission", icon: FileText },
    { name: " Cert Verify", href: "/certificate-verification", icon: CheckCircle },
    { name: "Stories", href: "/testimonials", icon: Star },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Donate", href: "/donate", icon: Heart },
  ];

  // ✅ Smooth Scroll Function
  const handleScroll = (e, href) => {
    e.preventDefault();
    setIsOpen(false);

    setTimeout(() => {
      const section = document.querySelector(href);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  // Handle both anchor scrolling and route navigation
  const handleNav = (e, href) => {
    // Anchor link (in-page)
    if (href && href.startsWith('#')) {
      // If already on home page, just scroll. Otherwise navigate to home then scroll.
      if (window.location.pathname === '/') {
        handleScroll(e, href);
      } else {
        e.preventDefault();
        setIsOpen(false);
        navigate('/');
        setTimeout(() => {
          const section = document.querySelector(href);
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
      return;
    }

    // Route navigation
    if (href && href.startsWith('/')) {
      e.preventDefault();
      setIsOpen(false);
      navigate(href);
    }
  };

  return (
    <nav className="fixed top-0 w-full h-16 bg-white/90 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP BAR */}
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <div className="leading-tight">
              <p className="text-sm font-bold text-gray-800">Institute Of</p>
              <p className="text-xs font-bold text-green-600 tracking-wide">
                Information Technology
              </p>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNav(e, item.href)}
                  className="relative group flex items-center gap-2 text-gray-700 text-sm font-medium hover:text-green-800 cursor-pointer transition"
                >
                  <Icon size={16} className="group-hover:text-green-600 transition" />

                  <span className="group-hover:text-green-800 transition">
                    {item.name}
                  </span>

                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              );
            })}
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-100 active:scale-95 transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white border-t ${
            isOpen ? "max-h-120 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
          }`}
        >
          <div className="px-3 space-y-1">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNav(e, item.href)}
                  className="group relative flex flex-col sm:flex-row sm:items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-800 transition cursor-pointer"
                >
                  <div className="flex items-center w-full sm:w-auto gap-3">
                    <Icon size={18} className="text-gray-600 group-hover:text-green-600 hover:text-green-600 transition" />
                    <span className="text-sm font-medium transition group-hover:text-green-800 hover:text-green-800">
                      {item.name}
                    </span>
                  </div>

                  <span className="block h-[2px] bg-green-600 w-0 group-hover:w-full hover:w-full transition-all duration-300 mt-2 sm:mt-0"></span>

                  <span className="absolute inset-0 rounded-lg focus-visible:ring-2 focus-visible:ring-green-300 -z-10"></span>
                </a>
              );
            })}

          </div>
        </div>

      </div>
    </nav>
  );
}