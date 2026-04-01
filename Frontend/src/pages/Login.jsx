import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle("Login | Skillify");
    return () => resetPageTitle();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(formData);
      if (response?.user?.profileComplete) navigate("/dashboard");
      else navigate("/complete-profile");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap flex items-center justify-center min-h-[calc(100vh-160px)]">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className="overflow-hidden rounded-2xl bg-white shadow-lg grid lg:grid-cols-2"
          style={{ border: "1px solid var(--color-neutral-200)" }}
        >
          {/* Decorative Section */}
          <div
            className="relative hidden w-full flex-col items-start justify-center p-12 lg:flex text-white overflow-hidden"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            <div className="relative z-10 w-full animate-fade-in-up">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide mb-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                Welcome Back
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Continue your workflow
              </h1>
              <p
                className="text-lg max-w-md mb-8 leading-relaxed"
                style={{ color: "var(--color-primary-100)" }}
              >
                Log in and pick up where you left off. Manage your projects,
                connect with clients, and grow your freelance career.
              </p>

              <div className="space-y-4 text-sm font-medium">
                <div
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p style={{ color: "var(--color-primary-50)" }}>
                    Discover active opportunities
                  </p>
                </div>
                <div
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <p style={{ color: "var(--color-primary-50)" }}>
                    Apply with your profile instantly
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex w-full flex-col justify-center p-8 sm:p-12 lg:p-16 animate-fade-in z-10 bg-white">
            <div className="mx-auto w-full max-w-md">
              <div className="text-center mb-10">
                <h2
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  Sign in
                </h2>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Access your Skillify account
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl px-4 py-3 text-sm font-medium animate-slide-in-right alert-error">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5"
                      style={{ color: "var(--color-error-500)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{ color: "var(--color-neutral-700)" }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="input-base"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      className="block text-sm font-semibold"
                      style={{ color: "var(--color-neutral-700)" }}
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-sm font-semibold transition-colors"
                      style={{ color: "var(--color-primary-600)" }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="input-base"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-base relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white/90"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center space-y-3">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-neutral-600)" }}
                >
                  New to Skillify?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold transition-colors"
                    style={{ color: "var(--color-primary-600)" }}
                  >
                    Create an account
                  </Link>
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Need to verify your email?{" "}
                  <Link
                    to="/verify-email"
                    className="font-semibold transition-colors"
                    style={{ color: "var(--color-primary-600)" }}
                  >
                    Verify now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
