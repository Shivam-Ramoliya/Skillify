import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle("Forgot Password | Skillify");
    return () => resetPageTitle();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword(email.trim());
      toast.success(
        response.message ||
          "If an account exists for that email, a reset link has been sent.",
      );
    } catch (err) {
      toast.error(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap relative flex items-center justify-center min-h-[calc(100vh-160px)] py-12">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-200 blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent-200 blur-3xl opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-indigo-500/10">
          <div
            className="px-8 py-10 text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-500) 48%, var(--color-accent-600) 100%)",
            }}
          >
            <span
              className="inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
            >
              Password Reset
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Send yourself a new sign-in link
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Enter the email attached to your Skillify account and we will send
              a secure reset link right away.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="forgot-password-email"
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: "var(--color-neutral-700)" }}
                >
                  Email address
                </label>
                <input
                  id="forgot-password-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="input-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="btn-primary w-full py-3.5 text-base"
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-3 text-center">
              <p className="text-sm font-medium text-slate-500">
                Remembered your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold transition-colors"
                  style={{ color: "var(--color-primary-600)" }}
                >
                  Back to login
                </Link>
              </p>
              <p className="text-xs leading-6 text-slate-400">
                The reset link is sent by email and expires after one hour.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
