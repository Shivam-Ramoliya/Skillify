import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle("Reset Password | Skillify");
    return () => resetPageTitle();
  }, []);

  const canSubmit = useMemo(
    () => token && formData.password && formData.confirmPassword,
    [token, formData.password, formData.confirmPassword],
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Missing reset token. Please request a new reset link.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setMessage(response.message || "Password reset successfully");
      if (response.user?.profileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/complete-profile");
      }
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap relative flex items-center justify-center min-h-[calc(100vh-160px)] py-12">
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary-200 blur-3xl opacity-35 pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-200 blur-3xl opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-indigo-500/10">
          <div
            className="px-8 py-10 text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-500) 45%, var(--color-accent-600) 100%)",
            }}
          >
            <span
              className="inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
            >
              New Password
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Create a new password
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              {email
                ? `Reset the password for ${email}.`
                : "Use the secure reset link from your email to choose a new password."}
            </p>
          </div>

          <div className="p-8 sm:p-10">
            {message && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="reset-password-new"
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: "var(--color-neutral-700)" }}
                >
                  New password
                </label>
                <input
                  id="reset-password-new"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter a new password"
                  className="input-base"
                />
              </div>

              <div>
                <label
                  htmlFor="reset-password-confirm"
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: "var(--color-neutral-700)" }}
                >
                  Confirm password
                </label>
                <input
                  id="reset-password-confirm"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your new password"
                  className="input-base"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                Use 8 or more characters for a stronger password.
              </div>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="btn-primary w-full py-3.5 text-base"
              >
                {loading ? "Resetting password..." : "Reset password"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold transition-colors"
                style={{ color: "var(--color-primary-600)" }}
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
