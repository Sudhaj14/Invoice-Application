import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const isAuthenticated = true;

  const user = {
    name: "Alex",
    email: "alex@timetoprogram.com",
  };

  const logout = () => {
    console.log("Logged out");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              AI Invoice App
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">

            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 font-medium transition"
            >
              Features
            </a>

            <a
              href="#testimonials"
              className="text-gray-600 hover:text-gray-900 font-medium transition"
            >
              Testimonials
            </a>

            <a
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 font-medium transition"
            >
              Pricing
            </a>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg border py-2">

                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>

                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Settings
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 🔽 Mobile Dropdown Menu (LIKE IMAGE) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

            <a
              href="#features"
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Features
            </a>

            <a
              href="#testimonials"
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Testimonials
            </a>

            <a
              href="#pricing"
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Pricing
            </a>

            <div className="border-t border-gray-200 my-2"></div>

            {isAuthenticated ? (
              <div className="p-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="block w-full text-left px-4 py-3 bg-gray-900 text-white hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
