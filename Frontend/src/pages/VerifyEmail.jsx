import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function VerifyEmail() {
  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const defaultCode = searchParams.get("code") || "";

  const [digits, setDigits] = useState(() => {
    if (defaultCode.length === 8) return defaultCode.split("");
    return Array(8).fill("");
  });
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    setPageTitle("Verify Email | Skillify");
    return () => resetPageTitle();
  }, []);

  // Auto-verify if code comes from URL
  useEffect(() => {
    if (defaultCode.length === 8) {
      setDigits(defaultCode.split(""));
    }
  }, [defaultCode]);

  const code = useMemo(() => digits.join(""), [digits]);
  const canVerify = useMemo(
    () => code.length === 8 && /^\d{8}$/.test(code),
    [code],
  );

  const handleDigitChange = (index, value) => {
    // Handle paste
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, "").slice(0, 8).split("");
      const newDigits = [...digits];
      pastedDigits.forEach((d, i) => {
        if (index + i < 8) newDigits[index + i] = d;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(index + pastedDigits.length, 7);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!canVerify) return;

    setLoading(true);
    setError("");
    try {
      const response = await verifyEmail(code);
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
        <div className="overflow-hidden rounded-[2.5rem] bg-white/70 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl border border-white/80 animate-fade-in-up relative">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>

          <div className="p-8 sm:p-12 relative z-10">
            <div className="text-center mb-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-8 border border-white/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Verify Email</h2>
              <p className="mt-3 text-base font-medium text-slate-500">
                Enter the 8-digit code sent to your email to verify your identity.
              </p>
            </div>

            {message && (
              <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-8 text-sm flex items-center gap-3 shadow-sm backdrop-blur-sm">
                <svg className="w-5 h-5 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">{message}</span>
              </div>
            )}
            
            {error && (
               <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8 text-sm flex items-center gap-3 shadow-sm backdrop-blur-sm animate-slide-in-right">
                <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify}>
              <div className="flex justify-center gap-1.5 sm:gap-2.5 mb-10">
                {digits.map((digit, index) => (
                  <span key={index} className="contents">
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
                        if (pasted) handleDigitChange(0, pasted);
                      }}
                      className="w-10 h-14 sm:w-12 sm:h-16 text-center text-2xl font-black bg-white/90 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 text-indigo-900 shadow-sm"
                    />
                    {index === 3 && (
                      <span className="flex items-center text-slate-300 font-bold text-2xl mx-1 sm:mx-2">-</span>
                    )}
                  </span>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || !canVerify}
                className="btn-primary w-full py-4 text-lg tracking-wide shadow-xl shadow-indigo-500/20"
              >
                {loading ? (
                   <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white/90" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
              <form onSubmit={handleResend} className="space-y-4 max-w-sm mx-auto">
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
                 <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
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
