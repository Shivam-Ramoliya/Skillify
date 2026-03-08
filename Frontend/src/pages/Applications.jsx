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
  const [receivedApplications, setReceivedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("received");
  const [actionLoadingId, setActionLoadingId] = useState("");

  const loadApplications = async () => {
    setError("");
    setLoading(true);
    try {
      const [sentRes, receivedRes] = await Promise.all([
        api.getSentApplications(),
        api.getReceivedApplications(),
      ]);
      setSentApplications(sentRes.data || []);
      setReceivedApplications(receivedRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageTitle("Applications | Skillify");
    loadApplications();
    return () => resetPageTitle();
  }, []);

  const updateStatus = async (applicationId, status) => {
    setActionLoadingId(applicationId + status);
    setError("");
    try {
      await api.updateApplicationStatus(applicationId, status);
      await loadApplications();
    } catch (err) {
      setError(err.message || "Failed to update application status");
    } finally {
      setActionLoadingId("");
    }
  };

  if (loading) return <LoadingSpinner />;

  const activeButton =
    "rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all";
  const inactiveButton =
    "rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/80 px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-white hover:text-indigo-600 transition-all shadow-sm";

  return (
    <div className="page-wrap relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute top-60 left-0 w-[400px] h-[400px] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="page-container space-y-8 relative z-10 max-w-5xl">
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
              type="button"
              onClick={() => setActiveTab("received")}
              className={activeTab === "received" ? activeButton : inactiveButton}
            >
              Received ({receivedApplications.length})
            </button>
            <button
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
             <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {error}
          </div>
        )}

        <div className="animate-fade-in">
          {activeTab === "received" ? (
            <section className="space-y-6">
              {receivedApplications.length === 0 ? (
                <div className="glass-card p-16 text-center border border-white/60">
                  <div className="w-20 h-20 mx-auto bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                    <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">No applications received yet</h3>
                  <p className="text-slate-500 font-medium">When freelancers apply to your published jobs, they will appear here.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {receivedApplications.map((application, index) => {
                  const applicant = application.applicant || {};
                  const job = application.job || {};
                  const status = application.status || "pending";

                  return (
                    <article
                      key={application._id}
                      className="group glass-card p-6 md:p-8 border border-white/60 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                       <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-black text-xl border border-indigo-200/50 shadow-sm flex-shrink-0 group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
                             {applicant.name ? applicant.name.charAt(0).toUpperCase() : "?"}
                           </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                              {job.jobName || "Job"}
                            </h3>
                            <div className="mt-2 text-sm font-medium text-slate-600 space-y-1">
                               <p className="flex items-center gap-1.5">
                                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                  {applicant.name || "Unknown user"}
                               </p>
                               {applicant.location && (
                                  <p className="flex items-center gap-1.5 text-slate-500">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {applicant.location}
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
                        {applicant._id && (
                          <Link
                            to={`/profile/${applicant._id}`}
                            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm text-sm"
                          >
                            View Profile
                          </Link>
                        )}

                        {status === "pending" && (
                          <div className="flex gap-2 ml-auto">
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(application._id, "accepted")
                              }
                              disabled={
                                actionLoadingId === application._id + "accepted"
                              }
                              className="px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 border border-emerald-200 transition-all shadow-sm text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                              {actionLoadingId === application._id + "accepted" ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              )}
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(application._id, "rejected")
                              }
                              disabled={
                                actionLoadingId === application._id + "rejected"
                              }
                              className="px-5 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 border border-rose-200 transition-all shadow-sm text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                              {actionLoadingId === application._id + "rejected" ? (
                                 <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              )}
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
                </div>
              )}
            </section>
          ) : (
            <section className="space-y-6">
              {sentApplications.length === 0 ? (
                <div className="glass-card p-16 text-center border border-white/60">
                  <div className="w-20 h-20 mx-auto bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                     <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">No applications sent yet</h3>
                  <p className="text-slate-500 font-medium">Head over to Discover to find and apply for jobs.</p>
                  <Link to="/discover" className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm">Discover Jobs</Link>
                </div>
              ) : (
                <div className="grid gap-6">
                {sentApplications.map((application, index) => {
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
                                 <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                 Posted by: {employer.name || "Unknown user"}
                               </p>
                               {job.experienceRequired && (
                                <p className="flex items-center gap-1.5 text-slate-500">
                                   <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
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
                            onClick={() =>
                              updateStatus(application._id, "withdrawn")
                            }
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
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
