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
    setPageTitle("Verify Email");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
          <p className="text-teal-100 text-sm mt-1">
            Enter the 8-digit code sent to your email
          </p>
        </div>

        <div className="p-8">
          {message && (
            <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleVerify}>
            {/* 8-digit code input boxes */}
            <div className="flex justify-center gap-2 mb-4">
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
                      const pasted = e.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, 8);
                      if (pasted) handleDigitChange(0, pasted);
                    }}
                    className="w-10 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 text-gray-800"
                  />
                  {index === 3 && (
                    <span className="flex items-center text-gray-300 font-bold text-xl mx-0.5">
                      -
                    </span>
                  )}
                </span>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !canVerify}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
              Didn't receive the code?
            </h3>
            <form onSubmit={handleResend} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition-all text-sm"
              />
              <button
                type="submit"
                disabled={resendLoading || !email.trim()}
                className="w-full border-2 border-teal-600 text-teal-600 font-medium py-2.5 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {resendLoading ? "Sending..." : "Resend Code"}
              </button>
            </form>
          </div>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Back to{" "}
            <Link
              to="/login"
              className="text-teal-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
