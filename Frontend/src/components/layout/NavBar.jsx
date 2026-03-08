import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const guestLinks = [
  { to: "/", label: "Home" },
  { to: "/login", label: "Login" },
];

const authLinks = [
  { to: "/discover", label: "Discover Jobs" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/publish-job", label: "Publish Job" },
  { to: "/applications", label: "Applications" },
  { to: "/profile", label: "Profile" },
];

const linkClass = ({ isActive }) =>
  `rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
    isActive
      ? "bg-indigo-50 text-indigo-700 shadow-sm"
      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
  }`;

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  const links = user ? authLinks : guestLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
      <nav className="page-container">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40">
               <img
                  src="/Skillify.png"
                  alt="Skillify"
                  className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-80"
                />
                <span className="relative z-10 text-xl font-bold tracking-tighter">S</span>
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-colors duration-300">
                Skillify
              </p>
              <p className="text-[11px] font-medium leading-none text-slate-500">
                Freelancer Network
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-sm">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end>
                {link.label}
              </NavLink>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            {user ? (
               <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow transition-all duration-200"
                >
                  Logout
                </button>
            ) : (
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 md:hidden transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
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

        {mobileOpen && (
          <div className="space-y-1 pb-6 pt-4 md:hidden animate-fade-in-up border-t border-slate-100">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`
                }
                onClick={closeMobile}
                end
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-slate-100 mt-4">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-slate-100 px-4 py-3 text-left text-base font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/signup"
                  onClick={closeMobile}
                  className="flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-base font-semibold text-white shadow-lg hover:shadow-indigo-500/50 transition-all"
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
