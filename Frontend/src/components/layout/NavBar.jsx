import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Code2 } from "lucide-react";

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
  `relative rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
    isActive
      ? "text-primary-700 bg-primary-50 shadow-sm"
      : "text-neutral-600 hover:text-primary-600 hover:bg-primary-50/50"
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
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Premium Glass Backdrop */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl border-b border-neutral-200/60 shadow-[0_4px_24px_-2px_rgba(0,0,0,0.03)] pointer-events-none"></div>

      <nav className="page-container relative z-10">
        <div className="flex h-[4.5rem] items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br from-primary-600 to-accent-500">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight transition-colors duration-300 text-neutral-900 group-hover:text-primary-600">
                Skillify
              </p>
              <p className="text-[11px] font-bold leading-none tracking-wider uppercase text-neutral-500">
                Freelancer Network
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1.5 md:flex p-1.5 rounded-2xl border bg-white/50 border-neutral-200/60 shadow-inner">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold shadow-sm transition-all duration-300 hover:bg-error-50 hover:text-error-600 hover:border-error-200 border border-neutral-200 text-neutral-700 hover:shadow-md"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link to="/signup" className="btn-primary py-2.5 px-6 shadow-md">
                Sign Up
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-xl p-2.5 md:hidden transition-all text-neutral-600 hover:bg-neutral-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-neutral-100"
            >
              <div className="space-y-1 pb-6 pt-4">
                {links.map((link, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={link.to}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `block rounded-2xl px-5 py-3.5 text-base font-bold transition-all duration-200 ${
                          isActive
                            ? "bg-primary-50 text-primary-700 shadow-sm"
                            : "text-neutral-600 hover:bg-primary-50 hover:text-primary-600"
                        }`
                      }
                      onClick={closeMobile}
                      end
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: links.length * 0.05 }}
                  className="pt-4 mt-4 border-t border-neutral-100"
                >
                  {user ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-bold transition-colors bg-error-50 text-error-600 border border-error-100"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/signup"
                      onClick={closeMobile}
                      className="flex w-full justify-center btn-primary py-4 text-base shadow-lg"
                    >
                      Sign Up
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
