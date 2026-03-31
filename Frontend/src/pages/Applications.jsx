import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

const statusClassMap = {
  pending: "bg-amber-100/80 text-amber-800 border-amber-200 shadow-sm",
  accepted: "bg-emerald-100/80 text-emerald-800 border-emerald-200 shadow-sm",
  rejected: "bg-red-100/80 text-red-800 border-red-200 shadow-sm",
  withdrawn: "bg-slate-100/80 text-slate-700 border-slate-200 shadow-sm",
};

export default function Applications() {
  const [sentApplications, setSentApplications] = useState([]);
  const [myPostedJobs, setMyPostedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobAppsLoading, setJobAppsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("received");
  const [actionLoadingId, setActionLoadingId] = useState("");

  const loadInitialData = async () => {
    setError("");
    setLoading(true);
    try {
      const [sentRes, postsRes] = await Promise.all([
        api.getSentApplications(),
        api.getMyPostedJobs(),
      ]);
      setSentApplications(sentRes.data || []);
      setMyPostedJobs(postsRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageTitle("Applications | Skillify");
    loadInitialData();
    return () => resetPageTitle();
  }, []);

  const handleSelectJob = async (job) => {
    setSelectedJob(job);
    setJobAppsLoading(true);
    setError("");
    try {
      const res = await api.getReceivedApplicationsForJob(job._id);
      setJobApplications(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load applications for this job");
    } finally {
      setJobAppsLoading(false);
    }
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
    setJobApplications([]);
  };

  const updateStatus = async (applicationId, status) => {
    setActionLoadingId(applicationId + status);
    setError("");
    try {
      await api.updateApplicationStatus(applicationId, status);
      // Refresh the applications for this specific job
      if (selectedJob) {
        const res = await api.getReceivedApplicationsForJob(selectedJob._id);
        setJobApplications(res.data || []);
        // Also update applicant counts
        const postsRes = await api.getMyPostedJobs();
        setMyPostedJobs(postsRes.data || []);
      }
    } catch (err) {
      setError(err.message || "Failed to update application status");
    } finally {
      setActionLoadingId("");
    }
  };

  const withdrawApplication = async (applicationId) => {
    setActionLoadingId(applicationId + "withdrawn");
    setError("");
    try {
      await api.updateApplicationStatus(applicationId, "withdrawn");
      const sentRes = await api.getSentApplications();
      setSentApplications(sentRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to withdraw application");
    } finally {
      setActionLoadingId("");
    }
  };

  if (loading) return <LoadingSpinner />;

  const activeButton =
    "rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all";
  const inactiveButton =
    "rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/80 px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-white hover:text-indigo-600 transition-all shadow-sm";

  const totalReceivedCount = myPostedJobs.reduce(
    (sum, job) => sum + (job.applicantCount || 0),
    0,
  );

  return (
    <div className="page-wrap relative" id="applications-page">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none"></div>
      <div
        className="absolute top-60 left-0 w-[400px] h-[400px] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="page-container space-y-8 relative z-10 max-w-5xl">
        {/* Header */}
        <section className="glass-card p-8 md:p-10 border border-white/60 bg-white/60 shadow-xl shadow-indigo-900/5 relative overflow-hidden flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
              Applications
            </h1>
            <p className="text-lg font-medium text-slate-600">
              Track what you received and what you sent in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10 bg-slate-50/50 p-2 rounded-2xl border border-slate-200/50 backdrop-blur-md self-start md:self-end">
            <button
              id="tab-received"
              type="button"
              onClick={() => {
                setActiveTab("received");
                handleBackToJobs();
              }}
              className={
                activeTab === "received" ? activeButton : inactiveButton
              }
            >
              Received ({totalReceivedCount})
            </button>
            <button
              id="tab-sent"
              type="button"
              onClick={() => setActiveTab("sent")}
              className={activeTab === "sent" ? activeButton : inactiveButton}
            >
              Sent ({sentApplications.length})
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-6 py-4 text-sm font-medium text-red-700 flex items-center gap-3 shadow-sm animate-fade-in-up">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        <div className="animate-fade-in">
          {activeTab === "received" ? (
            selectedJob ? (
              <ReceivedJobApplications
                job={selectedJob}
                applications={jobApplications}
                loading={jobAppsLoading}
                actionLoadingId={actionLoadingId}
                onBack={handleBackToJobs}
                onUpdateStatus={updateStatus}
              />
            ) : (
              <MyPostedJobsGrid
                jobs={myPostedJobs}
                onSelectJob={handleSelectJob}
              />
            )
          ) : (
            <SentApplicationsList
              applications={sentApplications}
              actionLoadingId={actionLoadingId}
              onWithdraw={withdrawApplication}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Received Tab: Level 1 — Job Posts Grid ────────────────────────── */
function MyPostedJobsGrid({ jobs, onSelectJob }) {
  if (jobs.length === 0) {
    return (
      <div className="glass-card p-16 text-center border border-white/60">
        <div className="w-20 h-20 mx-auto bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
          <svg
            className="w-10 h-10 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          No job posts yet
        </h3>
        <p className="text-slate-500 font-medium">
          Publish a job to start receiving applications from talented
          freelancers.
        </p>
        <Link
          to="/publish-job"
          className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Publish a Job
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="mb-6 flex items-center justify-between px-2">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <span className="flex h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
          Your Job Posts
        </h2>
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-sm font-bold text-indigo-700 shadow-sm">
          {jobs.length} {jobs.length === 1 ? "post" : "posts"}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {jobs.map((job, index) => (
          <article
            key={job._id}
            id={`job-card-${job._id}`}
            onClick={() => onSelectJob(job)}
            className="group glass-card p-6 md:p-8 border border-white/60 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

            {/* Header: Job name + applicant count */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl border border-indigo-100/50 shadow-sm flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
                  {job.jobName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1">
                    {job.jobName}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Posted{" "}
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Applicant count badge */}
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                    job.applicantCount > 0
                      ? "bg-indigo-100/80 text-indigo-800 border-indigo-200 shadow-sm"
                      : "bg-slate-100/80 text-slate-500 border-slate-200 shadow-sm"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {job.applicantCount}{" "}
                  {job.applicantCount === 1 ? "applicant" : "applicants"}
                </span>
              </div>
            </div>

            {/* Job details preview */}
            <div className="my-3 flex-grow">
              <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 font-medium">
                {job.jobDetails}
              </p>
            </div>

            {/* Skills tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {(job.skillsRequired || []).slice(0, 5).map((skill) => (
                <span
                  key={`${job._id}-${skill}`}
                  className="rounded-lg bg-indigo-50/80 px-3 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-100/60"
                >
                  {skill}
                </span>
              ))}
              {(job.skillsRequired || []).length > 5 && (
                <span className="rounded-lg bg-slate-50/80 px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-100/60">
                  +{job.skillsRequired.length - 5} more
                </span>
              )}
            </div>

            {/* Info grid */}
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="bg-indigo-100 p-1.5 rounded-lg">
                  <svg
                    className="w-4 h-4 text-indigo-600"
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
                <span className="font-semibold text-slate-900">
                  {job.experienceRequired}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-slate-900">
                  {job.salary || "Unpaid"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="bg-purple-100 p-1.5 rounded-lg">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-slate-900 capitalize">
                  {job.compensationType}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="bg-pink-100 p-1.5 rounded-lg">
                  <svg
                    className="w-4 h-4 text-pink-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-slate-900 text-xs tracking-tight">
                  {new Date(job.durationFrom).toLocaleDateString()} -{" "}
                  {new Date(job.durationTo).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* CTA footer */}
            <div className="mt-auto border-t border-slate-100 pt-5 flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-2 transition-colors">
                View Applicants
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="flex items-center gap-2">
                {job.githubRepoUrl && (
                  <a
                    href={job.githubRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                    title="View Repository"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
                {job.jobDescriptionDocument && (
                  <a
                    href={job.jobDescriptionDocument}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                    title="View Document"
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Received Tab: Level 2 — Applications for a Specific Job ───────── */
function ReceivedJobApplications({
  job,
  applications,
  loading,
  actionLoadingId,
  onBack,
  onUpdateStatus,
}) {
  if (loading) return <LoadingSpinner />;

  const pendingCount = applications.filter(
    (a) => a.status === "pending",
  ).length;
  const acceptedCount = applications.filter(
    (a) => a.status === "accepted",
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === "rejected",
  ).length;

  return (
    <section className="space-y-6">
      {/* Back button + job header */}
      <div className="glass-card p-6 md:p-8 border border-white/60 bg-white/60 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
        <div className="relative z-10">
          <button
            type="button"
            onClick={onBack}
            id="btn-back-to-jobs"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors group/back"
          >
            <svg
              className="w-4 h-4 transform group-hover/back:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            Back to Job Posts
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/30 flex-shrink-0">
                {job.jobName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {job.jobName}
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  {job.skillsRequired?.join(" · ")}
                </p>
              </div>
            </div>

            {/* Status summary pills */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                {pendingCount} Pending
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {acceptedCount} Accepted
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                {rejectedCount} Rejected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Applications list */}
      {applications.length === 0 ? (
        <div className="glass-card p-16 text-center border border-white/60">
          <div className="w-20 h-20 mx-auto bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <svg
              className="w-10 h-10 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
            No applications yet
          </h3>
          <p className="text-slate-500 font-medium">
            No one has applied to this job yet. Share it to attract applicants!
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {applications.map((application, index) => {
            const applicant = application.applicant || {};
            const status = application.status || "pending";

            return (
              <article
                key={application._id}
                id={`applicant-card-${application._id}`}
                className="group glass-card p-6 md:p-8 border border-white/60 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>

                <div className="flex flex-col gap-5">
                  {/* Applicant header row */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      {applicant.profilePicture ? (
                        <img
                          src={applicant.profilePicture}
                          alt={applicant.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0 group-hover:border-indigo-200 transition-colors"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-black text-xl border border-indigo-200/50 shadow-sm flex-shrink-0 group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
                          {applicant.name
                            ? applicant.name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                          {applicant.name || "Unknown user"}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-slate-500">
                          {applicant.currentRole && (
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 text-indigo-400"
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
                              {applicant.currentRole}
                              {applicant.company && ` at ${applicant.company}`}
                            </span>
                          )}
                          {applicant.location && (
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {applicant.location}
                            </span>
                          )}
                          {applicant.yearsOfExperience > 0 && (
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 text-purple-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {applicant.yearsOfExperience} yrs exp
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider self-start ${statusClassMap[status] || statusClassMap.pending}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Skills row */}
                  {applicant.skills && applicant.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.slice(0, 8).map((skill, i) => (
                        <span
                          key={`${application._id}-skill-${i}`}
                          className="rounded-lg bg-indigo-50/80 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-100/60"
                        >
                          {skill}
                        </span>
                      ))}
                      {applicant.skills.length > 8 && (
                        <span className="rounded-lg bg-slate-50/80 px-2.5 py-1 text-xs font-bold text-slate-500 border border-slate-100/60">
                          +{applicant.skills.length - 8} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Experience snippet */}
                  {applicant.experience && (
                    <p className="text-sm text-slate-600 font-medium line-clamp-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      {applicant.experience}
                    </p>
                  )}

                  {/* Applied date */}
                  <p className="text-xs font-semibold text-slate-400">
                    Applied{" "}
                    {new Date(application.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    {applicant._id && (
                      <Link
                        to={`/profile/${applicant._id}`}
                        className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm text-sm"
                      >
                        View Profile
                      </Link>
                    )}

                    {applicant.githubUrl && (
                      <a
                        href={applicant.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                        title="GitHub"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    )}

                    {applicant.linkedinUrl && (
                      <a
                        href={applicant.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                        title="LinkedIn"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}

                    {status === "pending" && (
                      <div className="flex gap-2 ml-auto">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStatus(application._id, "accepted")
                          }
                          disabled={
                            actionLoadingId === application._id + "accepted"
                          }
                          className="px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 border border-emerald-200 transition-all shadow-sm text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                          {actionLoadingId ===
                          application._id + "accepted" ? (
                            <svg
                              className="animate-spin h-4 w-4"
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
                          ) : (
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStatus(application._id, "rejected")
                          }
                          disabled={
                            actionLoadingId === application._id + "rejected"
                          }
                          className="px-5 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 border border-rose-200 transition-all shadow-sm text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                          {actionLoadingId ===
                          application._id + "rejected" ? (
                            <svg
                              className="animate-spin h-4 w-4"
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
                          ) : (
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ─── Sent Tab (unchanged behavior) ─────────────────────────────────── */
function SentApplicationsList({ applications, actionLoadingId, onWithdraw }) {
  if (applications.length === 0) {
    return (
      <div className="glass-card p-16 text-center border border-white/60">
        <div className="w-20 h-20 mx-auto bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
          <svg
            className="w-10 h-10 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          No applications sent yet
        </h3>
        <p className="text-slate-500 font-medium">
          Head over to Discover to find and apply for jobs.
        </p>
        <Link
          to="/discover"
          className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Discover Jobs
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-6">
        {applications.map((application, index) => {
          const employer =
            application.employer || application.job?.postedBy || {};
          const job = application.job || {};
          const status = application.status || "pending";

          return (
            <article
              key={application._id}
              className="group glass-card p-6 md:p-8 border border-white/60 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-700 font-black text-xl border border-purple-200/50 shadow-sm flex-shrink-0 group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white transition-all duration-300">
                    {job.jobName ? job.jobName.charAt(0).toUpperCase() : "J"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {job.jobName || "Job"}
                    </h3>
                    <div className="mt-2 text-sm font-medium text-slate-600 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-purple-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        Posted by: {employer.name || "Unknown user"}
                      </p>
                      {job.experienceRequired && (
                        <p className="flex items-center gap-1.5 text-slate-500">
                          <svg
                            className="w-4 h-4 text-slate-400"
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
                          Experience: {job.experienceRequired}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider self-start ${statusClassMap[status] || statusClassMap.pending}`}
                >
                  {status}
                </span>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
                {employer._id && (
                  <Link
                    to={`/profile/${employer._id}`}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm text-sm"
                  >
                    View Employer
                  </Link>
                )}
                {status === "pending" && (
                  <button
                    type="button"
                    onClick={() => onWithdraw(application._id)}
                    disabled={
                      actionLoadingId === application._id + "withdrawn"
                    }
                    className="px-5 py-2.5 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all shadow-sm text-sm disabled:opacity-50 ml-auto"
                  >
                    {actionLoadingId === application._id + "withdrawn"
                      ? "Withdrawing..."
                      : "Withdraw Application"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
