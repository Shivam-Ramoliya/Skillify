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
        <div className="overflow-hidden rounded-3xl bg-white/60 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl border border-white/80 grid lg:grid-cols-2">
          {/* Decorative Section */}
          <div className="relative hidden w-full flex-col items-start justify-center p-12 lg:flex bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            {/* Animated blob background */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-40 -right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-20 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '4s' }}></div>

            <div className="relative z-10 w-full animate-fade-in-up">
              <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold tracking-wide backdrop-blur-md border border-white/30 mb-6 shadow-sm">
                Welcome Back
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
                Continue your workflow
              </h1>
              <p className="text-lg text-indigo-100 max-w-md mb-8 leading-relaxed">
                Log in and pick up where you left off. Manage your projects, connect with clients, and grow your freelance career.
              </p>
              
              <div className="space-y-4 text-sm font-medium text-indigo-50/90">
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg">
                  <div className="bg-indigo-500/50 p-3 rounded-xl"><svg className="w-5 h-5 text-indigo-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                  <p>Discover active opportunities</p>
                </div>
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg">
                  <div className="bg-purple-500/50 p-3 rounded-xl"><svg className="w-5 h-5 text-indigo-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                  <p>Apply with your profile instantly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex w-full flex-col justify-center p-8 sm:p-12 lg:p-16 animate-fade-in z-10 bg-white/40">
            <div className="mx-auto w-full max-w-md">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Sign in</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Access your Skillify account
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-4 py-3 text-sm font-medium text-red-700 animate-slide-in-right shadow-sm">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
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
                    <label className="block text-sm font-bold text-slate-700">
                      Password
                    </label>
                    <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
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
                          <svg className="animate-spin h-5 w-5 text-white/90" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
                <p className="text-sm font-medium text-slate-600">
                  New to Skillify?{" "}
                  <Link
                    to="/signup"
                    className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Create an account
                  </Link>
                </p>
                <p className="text-sm font-medium text-slate-500">
                  Need to verify your email?{" "}
                  <Link
                    to="/verify-email"
                    className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
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
