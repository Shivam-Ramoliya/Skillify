import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="flex items-center gap-2">
              <img
                src="/Skillify.png"
                alt="Skillify"
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-2xl font-bold text-white group-hover:text-teal-100 transition-colors">
                Skillify
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="text-white hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/discover"
                  className="text-white hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Discover
                </Link>
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-white hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/connections"
                  className="text-white hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Connections
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 bg-white text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="ml-2 bg-white text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-teal-700 p-2 rounded-md transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-teal-700 border-t border-teal-500">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block text-white hover:bg-teal-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/discover"
                  onClick={closeMobileMenu}
                  className="block text-white hover:bg-teal-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Discover
                </Link>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="block text-white hover:bg-teal-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="block text-white hover:bg-teal-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/connections"
                  onClick={closeMobileMenu}
                  className="block text-white hover:bg-teal-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Connections
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full text-left text-white hover:bg-teal-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block text-white hover:bg-teal-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="block text-white hover:bg-teal-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
