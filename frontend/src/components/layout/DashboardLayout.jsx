import { useState, useEffect } from "react";
import {
  Briefcase,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

import { NAVIGATION_MENU } from "../../utils/data";

const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition
        ${
          isActive
            ? "bg-blue-50 text-blue-900 shadow-sm shadow-blue-50"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive ? "text-blue-900" : "text-gray-500"
        }`}
      />
      {!isCollapsed && (
        <span className="ml-3 truncate">{item.name}</span>
      )}
    </button>
  );
};

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = () => {
    console.log("Logout clicked"); // ✅ debug
    logout();                      // clear auth
    navigate("/login");            // redirect
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= CLOSE DROPDOWN ================= */

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  /* ================= HANDLERS ================= */

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarCollapsed = !isMobile && false;

  /* ================= UI ================= */
console.log(user);
useEffect(() => {
  console.log("DashboardLayout user:", user);
}, [user]);  return (
    <div className="flex h-screen bg-background-deep text-text-primary">
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform glass
        ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
        ${sidebarCollapsed ? "w-16" : "w-64"}
        border-r border-white/10`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 border-b border-white/10 px-6">
          <Link
            to="/dashboard"
            className="flex items-center space-x-3"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-accent-purple to-accent-blue rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              <Briefcase className="text-white w-4 h-4" />
            </div>

            {!sidebarCollapsed && (
              <span className="text-white font-bold text-xl tracking-tight">
                AI Invoice App
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAVIGATION_MENU.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-accent-blue/10 text-accent-neon shadow-[0_0_20px_rgba(37,99,235,0.15)] border border-accent-blue/30"
                      : "text-text-secondary hover:bg-white/5 hover:text-white"
                  }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? "text-accent-neon" : "text-text-muted"
                  }`}
                />
                {!sidebarCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && (
              <span className="ml-3">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-md"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
        ${isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"}`}
      >
        {/* Top Navbar */}
        <header className="bg-background-deep/40 backdrop-blur-lg border-b border-white/10 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          
          {/* Mobile Toggle */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl hover:bg-white/5 text-text-secondary transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Welcome Text */}
          <div>
            <h1 className="text-lg font-semibold text-white">
              Welcome back, <span className="text-accent-blue">{user?.name}</span>!
            </h1>
            
            <p className="text-sm text-text-secondary hidden sm:block">
              Here's your invoice overview.
            </p>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center space-x-3">
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle = {(e) =>{
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              avatar = {user?.avatar ||""}
              companyName={user?.name || ""}
              email={user?.email||""}
              onLogout={handleLogout} 
            />
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );

};

export default DashboardLayout;