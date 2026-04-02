import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function Dashboard() {
  const { user } = useAuth();
  const [profileStatus, setProfileStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle("Dashboard | Skillify");
    return () => resetPageTitle();
  }, []);

  useEffect(() => {
    fetchProfileStatus();
  }, []);

  const fetchProfileStatus = async () => {
    try {
      const response = await api.getProfileStatus();
      if (response.success) setProfileStatus(response.data);
    } catch {
      // keep page usable even if stats fail
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const completion = profileStatus?.completionPercentage || 0;
  const missingFields = profileStatus?.missingFields || [];

  return (
    <div className="page-wrap relative">
      {/* Subtle Background */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob pointer-events-none"
        style={{ backgroundColor: "var(--color-primary-200)" }}
      ></div>

      <div className="page-container space-y-8 relative z-10">
        <section
          className="glass-card p-8 md:p-10 text-white overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-accent-600) 100%)" }}
        >
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Workspace
              </span>
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              Welcome,{" "}
              <span style={{ color: "var(--color-primary-100)" }}>
                {user?.name}
              </span>
            </h1>
            <p
              className="mt-4 text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--color-primary-100)" }}
            >
              Manage your freelance profile, discover unparalleled
              opportunities, and track your applications in real-time.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="glass-card p-6 md:p-8 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ backgroundColor: "var(--color-primary-50)" }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: "var(--color-primary-600)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  Profile completion
                </h2>
              </div>
              <span
                className="rounded-xl px-4 py-1.5 text-sm font-semibold"
                style={{
                  backgroundColor: "var(--color-primary-50)",
                  color: "var(--color-primary-700)",
                  border: "1px solid var(--color-primary-100)",
                }}
              >
                {completion}%
              </span>
            </div>

            <div
              className="mt-6 h-3 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--color-neutral-100)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${completion}%`,
                  backgroundColor: "var(--color-primary-500)",
                }}
              />
            </div>

            {missingFields.length > 0 ? (
              <div className="mt-8 rounded-xl p-5 alert-warning">
                <div className="flex gap-4">
                  <div
                    className="p-2 rounded-xl flex-shrink-0 self-start"
                    style={{ backgroundColor: "var(--color-warning-100)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: "var(--color-warning-600)" }}
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
                  <div>
                    <h3
                      className="text-sm font-semibold tracking-wide uppercase"
                      style={{ color: "var(--color-warning-700)" }}
                    >
                      Complete these fields to boost visibility:
                    </h3>
                    <p
                      className="mt-1 text-sm font-medium leading-relaxed max-w-lg"
                      style={{ color: "var(--color-warning-600)" }}
                    >
                      {missingFields.join(", ")}
                    </p>
                    <Link
                      to="/complete-profile"
                      className="btn-primary mt-4 py-2.5 px-6 text-sm"
                    >
                      Complete Profile
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-xl p-5 flex items-start gap-4 alert-success">
                <div
                  className="p-2.5 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: "var(--color-accent-100)" }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "var(--color-accent-600)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold tracking-wide uppercase mt-0.5"
                    style={{ color: "var(--color-accent-800)" }}
                  >
                    Profile is 100% complete
                  </h3>
                  <p
                    className="mt-1 text-sm font-medium max-w-lg"
                    style={{ color: "var(--color-accent-700)" }}
                  >
                    Your profile is fully optimized and ready to attract top
                    clients and collaborators.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6 md:p-8">
            <h2
              className="text-2xl font-bold tracking-tight flex items-center gap-4 mb-8"
              style={{ color: "var(--color-neutral-900)" }}
            >
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: "var(--color-primary-50)" }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: "var(--color-primary-600)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              Quick stats
            </h2>
            <div className="space-y-4">
              <div
                className="rounded-xl p-5 transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--color-neutral-200)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Skills listed
                </p>
                <div className="flex items-baseline gap-2">
                  <p
                    className="text-4xl font-bold tracking-tighter"
                    style={{ color: "var(--color-neutral-900)" }}
                  >
                    {user?.skills?.length || 0}
                  </p>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-neutral-500)" }}
                  >
                    skills
                  </span>
                </div>
              </div>
              <div
                className="rounded-xl p-5 transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--color-neutral-200)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Experience
                </p>
                <div className="flex items-baseline gap-2">
                  <p
                    className="text-4xl font-bold tracking-tighter"
                    style={{ color: "var(--color-neutral-900)" }}
                  >
                    {user?.yearsOfExperience || 0}
                  </p>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-neutral-500)" }}
                  >
                    years
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card p-6 md:p-8">
          <h2
            className="text-2xl font-bold tracking-tight flex items-center gap-4 mb-8"
            style={{ color: "var(--color-neutral-900)" }}
          >
            <div
              className="p-2.5 rounded-xl"
              style={{ backgroundColor: "var(--color-primary-50)" }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: "var(--color-primary-600)" }}
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
            Quick actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/discover"
              className="group rounded-xl bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
              style={{ border: "1px solid var(--color-neutral-200)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-200 mb-5"
                style={{
                  backgroundColor: "var(--color-primary-50)",
                  color: "var(--color-primary-600)",
                }}
              >
                <svg
                  className="w-6 h-6"
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
              <h3
                className="font-semibold text-lg"
                style={{ color: "var(--color-neutral-900)" }}
              >
                Discover Jobs
              </h3>
              <p
                className="text-sm font-medium mt-1"
                style={{ color: "var(--color-neutral-500)" }}
              >
                Browse open opportunities
              </p>
            </Link>

            <Link
              to="/publish-job"
              className="group rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative overflow-hidden text-white"
              style={{ background: "linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-accent-600) 100%)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-all duration-200"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-white text-lg">Publish Job</h3>
              <p
                className="text-sm font-medium mt-1"
                style={{ color: "var(--color-primary-100)" }}
              >
                Hire top talent easily
              </p>
            </Link>

            <Link
              to="/applications"
              className="group rounded-xl bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
              style={{ border: "1px solid var(--color-neutral-200)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-200 mb-5"
                style={{
                  backgroundColor: "var(--color-primary-50)",
                  color: "var(--color-primary-600)",
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3
                className="font-semibold text-lg"
                style={{ color: "var(--color-neutral-900)" }}
              >
                Applications
              </h3>
              <p
                className="text-sm font-medium mt-1"
                style={{ color: "var(--color-neutral-500)" }}
              >
                Track your progress
              </p>
            </Link>

            <Link
              to="/profile"
              className="group rounded-xl bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
              style={{ border: "1px solid var(--color-neutral-200)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-200 mb-5"
                style={{
                  backgroundColor: "var(--color-primary-50)",
                  color: "var(--color-primary-600)",
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3
                className="font-semibold text-lg"
                style={{ color: "var(--color-neutral-900)" }}
              >
                Edit Profile
              </h3>
              <p
                className="text-sm font-medium mt-1"
                style={{ color: "var(--color-neutral-500)" }}
              >
                Update your info
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
