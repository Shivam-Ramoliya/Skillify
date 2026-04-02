import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function VerifyEmail() {
  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const defaultToken =
    searchParams.get("token") || searchParams.get("code") || "";

  const [code, setCode] = useState(() => defaultToken);
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setPageTitle("Verify Email | Skillify");
    return () => resetPageTitle();
  }, []);

  // Auto-verify if a signed token comes from the URL
  useEffect(() => {
    if (!defaultToken) return;

    let cancelled = false;

    const autoVerify = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await verifyEmail(defaultToken);
        if (cancelled) return;
        setMessage(response.message || "Email verified successfully");
        if (response.user?.profileComplete) {
          navigate("/dashboard");
        } else {
          navigate("/complete-profile");
        }
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Verification failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    autoVerify();

    return () => {
      cancelled = true;
    };
  }, [defaultToken, navigate, verifyEmail]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const canVerify = useMemo(() => code.trim().length > 0, [code]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setError("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!canVerify) return;

    setLoading(true);
    setError("");
    try {
      const response = await verifyEmail(code.trim());
      setMessage(response.message || "Email verified successfully");
      if (response.user?.profileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/complete-profile");
      }
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setResendLoading(true);
    setError("");
    try {
      const response = await resendVerification(email.trim());
      setMessage(response.message || "Verification email sent");
    } catch (err) {
      setError(err.message || "Failed to resend verification email");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="page-wrap flex items-center justify-center min-h-[calc(100vh-160px)] py-12">
      <div className="w-full max-w-xl px-4">
        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-blue-500/10 backdrop-blur-xl border border-slate-200/60 animate-fade-in-up relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>

          <div className="p-8 sm:p-12 relative z-10">
            <div className="text-center mb-10">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-5">
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Verify your email
              </h2>
              <p className="mt-3 text-base font-medium text-slate-500">
                Open the verification link we emailed you or paste the token
                below.
              </p>
            </div>

            {message && (
              <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-8 text-sm flex items-center gap-3 shadow-sm backdrop-blur-sm">
                <svg
                  className="w-5 h-5 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">{message}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8 text-sm flex items-center gap-3 shadow-sm backdrop-blur-sm animate-slide-in-right">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify}>
              <div className="mb-8">
                <input
                  ref={inputRef}
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="Paste verification token"
                  className="w-full text-center text-lg font-semibold rounded-2xl border border-slate-200 bg-white/80 px-4 py-5 text-slate-900 placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !canVerify}
                className="btn-primary w-full py-4 text-lg tracking-wide shadow-xl shadow-blue-500/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
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
                    Verifying...
                  </span>
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-200/60 bg-slate-50/50 -mx-8 sm:-mx-12 px-8 sm:px-12 -mb-8 sm:-mb-12 pb-8 sm:pb-12 text-center rounded-b-[2.5rem]">
              <h3 className="text-sm font-bold tracking-wide text-slate-700 mb-5 uppercase">
                Didn't receive the code?
              </h3>
              <form
                onSubmit={handleResend}
                className="space-y-4 max-w-sm mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-base bg-white"
                />
                <button
                  type="submit"
                  disabled={resendLoading || !email.trim()}
                  className="btn-secondary w-full py-3"
                >
                  {resendLoading ? "Sending..." : "Resend Code"}
                </button>
              </form>

              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
