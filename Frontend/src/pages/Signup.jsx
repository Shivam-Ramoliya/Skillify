import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const getPasswordChecks = (password) => {
    const checks = [
      {
        label: "8-50 characters",
        ok: password.length >= 8 && password.length <= 50,
      },
      { label: "At least 1 uppercase", ok: /[A-Z]/.test(password) },
      { label: "At least 1 lowercase", ok: /[a-z]/.test(password) },
      { label: "At least 1 number", ok: /\d/.test(password) },
      {
        label: "At least 1 symbol",
        ok: /[^A-Za-z0-9\s_-]/.test(password),
      },
      {
        label: "No spaces, underscores, or dashes",
        ok: !/[\s_-]/.test(password),
      },
    ];

    return checks;
  };

  useEffect(() => {
    setPageTitle("Sign Up");
    return () => resetPageTitle();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.name.length > 100) {
      addToast("error", "Name must be 100 characters or less");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8 || formData.password.length > 50) {
      addToast("error", "Password must be between 8 and 50 characters");
      setLoading(false);
      return;
    }

    const passwordChecks = getPasswordChecks(formData.password);
    const failedChecks = passwordChecks.filter((check) => !check.ok);
    if (failedChecks.length > 0) {
      addToast(
        "error",
        `Password missing: ${failedChecks
          .map((check) => check.label)
          .join(", ")}`,
      );
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast("error", "Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await signup(formData);
      if (response.success) {
        addToast("success", response.message);
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      addToast("error", err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join Skillify
            </h2>
            <p className="text-gray-600">Create your account today</p>
          </div>

          {toasts.length > 0 && (
            <div className="space-y-3 mb-6">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`px-4 py-3 rounded-lg flex items-start gap-3 border ${
                    toast.type === "success"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : toast.type === "warning"
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <span className="text-sm">{toast.message}</span>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={50}
                  placeholder="••••••••"
                  className="w-full pr-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.83 21.83 0 0 1 5.1-6.39" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                      <path d="M14.12 14.12L9.88 9.88" />
                      <path d="M9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a21.89 21.89 0 0 1-3.09 4.36" />
                      <path d="M12 9a3 3 0 0 1 3 3" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {getPasswordChecks(formData.password).map((check) => (
                  <div
                    key={check.label}
                    className={`text-xs flex items-center gap-2 ${
                      check.ok ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <span>{check.ok ? "✓" : "•"}</span>
                    <span>{check.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={50}
                  placeholder="••••••••"
                  className="w-full pr-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.83 21.83 0 0 1 5.1-6.39" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                      <path d="M14.12 14.12L9.88 9.88" />
                      <path d="M9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a21.89 21.89 0 0 1-3.09 4.36" />
                      <path d="M12 9a3 3 0 0 1 3 3" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-600 font-semibold hover:text-teal-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
