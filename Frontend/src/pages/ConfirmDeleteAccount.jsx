import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function ConfirmDeleteAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [message, setMessage] = useState("Deleting your account...");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    setPageTitle("Confirm Deletion | Skillify");
    return () => resetPageTitle();
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Missing deletion token. Please request a new deletion link.");
      return;
    }

    let cancelled = false;

    const confirmDeletion = async () => {
      try {
        const response = await api.deleteAccount(token);
        if (cancelled) return;
        setMessage(response.message || "Account deleted successfully");
        setTimeout(() => {
          logout();
          navigate("/", { replace: true });
        }, 1800);
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Failed to confirm account deletion");
        setLoading(false);
      }
    };

    confirmDeletion();

    return () => {
      cancelled = true;
    };
  }, [logout, navigate, token]);

  return (
    <div className="page-wrap relative flex items-center justify-center min-h-[calc(100vh-160px)] py-12">
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-error-50 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-100 blur-3xl opacity-35 pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-red-500/10">
          <div
            className="px-8 py-10 text-white"
            style={{
              background:
                "linear-gradient(135deg, #b91c1c 0%, #dc2626 48%, #e11d48 100%)",
            }}
          >
            <span className="inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-white/15">
              Account Deletion
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Confirming your deletion request
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Skillify is processing your secure deletion link.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            {loading && !error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {!token && (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-slate-600">
                  The deletion link is missing or incomplete. Request a new link
                  from your profile settings.
                </p>
                <Link
                  to="/profile"
                  className="btn-primary w-full py-3.5 text-base"
                >
                  Back to Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
