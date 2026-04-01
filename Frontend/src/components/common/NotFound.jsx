import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-wrap relative min-h-[calc(100vh-80px)] flex items-center justify-center py-10">
      <div className="page-container max-w-2xl relative z-10 w-full animate-fade-in-up">
        <div className="glass-card p-10 md:p-16 text-center">
          <div
            className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-8"
            style={{
              backgroundColor: "var(--color-error-50)",
              border: "1px solid var(--color-error-100)",
            }}
          >
            <svg
              className="w-12 h-12"
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
          </div>
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-error-500)" }}
          >
            Error 404
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "var(--color-neutral-900)" }}
          >
            Page not found
          </h1>
          <p
            className="mt-5 text-lg font-medium max-w-md mx-auto leading-relaxed"
            style={{ color: "var(--color-neutral-600)" }}
          >
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex btn-primary px-8 py-3.5 font-semibold text-lg transition-all hover:scale-105"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
