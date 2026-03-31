import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function DeleteAccountModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setStep(1); setOtp(""); setError(""); setLoading(false); setCountdown(0); setSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (step === 2 && inputRef.current) inputRef.current.focus();
  }, [step]);

  const handleSendOtp = async () => {
    setLoading(true); setError("");
    try {
      await api.requestAccountDeletion();
      setStep(2);
      setCountdown(600);
    } catch (err) {
      setError(err.message || "Failed to send verification code");
    } finally { setLoading(false); }
  };

  const handleConfirmDelete = async () => {
    if (otp.trim().length < 6) { setError("Please enter the 6-digit code"); return; }
    setLoading(true); setError("");
    try {
      await api.deleteAccount(otp.trim());
      setSuccess(true);
      setTimeout(() => { logout(); navigate("/", { replace: true }); }, 2000);
    } catch (err) {
      setError(err.message || "Failed to delete account");
    } finally { setLoading(false); }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!loading && !success ? onClose : undefined}></div>
      <div className="relative w-full max-w-md glass-card border border-white/60 shadow-2xl p-8 animate-fade-in-up">

        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Account Deleted</h3>
            <p className="text-sm text-slate-500 font-medium">Your account has been permanently deleted. Redirecting...</p>
          </div>
        ) : step === 1 ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Your Account?</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">This action is <strong className="text-red-600">permanent and irreversible</strong>.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 space-y-2">
              {["Your profile and personal information", "All job posts you've published", "All applications (sent & received)", "Uploaded files (resume, profile picture)"].map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm text-red-800 font-medium">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  {item}
                </p>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium text-center mb-6">We'll send a verification code to your email to confirm.</p>
            {error && <p className="text-sm text-red-600 font-medium text-center mb-4">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">Cancel</button>
              <button type="button" onClick={handleSendOtp} disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none">
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enter Verification Code</h3>
              <p className="text-sm text-slate-500 font-medium">We've sent a 6-digit code to your email.</p>
            </div>
            <div className="mb-4">
              <input
                ref={inputRef}
                type="text"
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                placeholder="000000"
                maxLength={6}
                className="w-full text-center text-3xl font-bold tracking-[0.5em] rounded-2xl border border-slate-200 bg-white/80 px-4 py-5 text-slate-900 placeholder:text-slate-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
              />
            </div>
            {countdown > 0 && (
              <p className="text-center text-sm font-semibold mb-4">
                <span className="text-slate-500">Expires in </span>
                <span className={countdown < 60 ? "text-red-600" : "text-slate-700"}>{formatTime(countdown)}</span>
              </p>
            )}
            {countdown === 0 && step === 2 && (
              <p className="text-center text-sm font-semibold text-red-600 mb-4">Code expired. <button type="button" onClick={handleSendOtp} className="underline hover:text-red-700">Resend code</button></p>
            )}
            {error && <p className="text-sm text-red-600 font-medium text-center mb-4">{error}</p>}
            <div className="flex gap-3 mb-4">
              <button type="button" onClick={onClose} disabled={loading} className="btn-secondary flex-1 py-3">Cancel</button>
              <button type="button" onClick={handleConfirmDelete} disabled={loading || otp.length < 6 || countdown === 0} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none">
                {loading ? "Deleting..." : "Delete My Account"}
              </button>
            </div>
            <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full text-center text-xs text-slate-500 font-semibold hover:text-indigo-600 transition-colors disabled:opacity-50">
              Didn't receive the code? Resend
            </button>
          </>
        )}
      </div>
    </div>
  );
}
