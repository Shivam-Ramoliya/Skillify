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
  `rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
    isActive
      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
      : "text-[var(--color-neutral-600)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-600)]"
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
    <header
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b transition-all duration-200"
      style={{ borderColor: "var(--color-neutral-200)" }}
    >
      <nav className="page-container">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105">
              <img
                src="/Skillify.png"
                alt="Skillify Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p
                className="text-lg font-bold tracking-tight transition-colors duration-200"
                style={{ color: "var(--color-neutral-900)" }}
              >
                Skillify
              </p>
              <p
                className="text-[10px] font-medium leading-none"
                style={{ color: "var(--color-neutral-500)" }}
              >
                Freelancer Network
              </p>
            </div>
          </Link>

          <div
            className="hidden items-center gap-1 md:flex p-1 rounded-xl border"
            style={{
              backgroundColor: "var(--color-neutral-50)",
              borderColor: "var(--color-neutral-200)",
            }}
          >
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
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-[var(--color-neutral-50)]"
                style={{
                  color: "var(--color-neutral-700)",
                  border: "1px solid var(--color-neutral-200)",
                }}
              >
                Logout
              </button>
            ) : (
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-xl p-2.5 md:hidden transition-colors"
            style={{ color: "var(--color-neutral-600)" }}
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
          <div
            className="space-y-1 pb-6 pt-4 md:hidden animate-fade-in-up border-t"
            style={{ borderColor: "var(--color-neutral-100)" }}
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                      : "text-[var(--color-neutral-600)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-600)]"
                  }`
                }
                onClick={closeMobile}
                end
              >
                {link.label}
              </NavLink>
            ))}
            <div
              className="pt-4 mt-4"
              style={{ borderTop: "1px solid var(--color-neutral-100)" }}
            >
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-3 text-left text-base font-semibold transition-colors"
                  style={{
                    backgroundColor: "var(--color-neutral-100)",
                    color: "var(--color-neutral-700)",
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/signup"
                  onClick={closeMobile}
                  className="flex w-full justify-center btn-primary py-3 text-base"
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
