import { useState, useEffect } from "react";
import { api } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

const statusClassMap = {
  pending: "bg-amber-100/80 text-amber-800 border-amber-200 shadow-sm",
  accepted: "bg-emerald-100/80 text-emerald-800 border-emerald-200 shadow-sm",
  rejected: "bg-red-100/80 text-red-800 border-red-200 shadow-sm",
  withdrawn: "bg-slate-100/80 text-slate-700 border-slate-200 shadow-sm",
};

export default function Discover() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchSkill, setSearchSkill] = useState("");
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [applyLoadingId, setApplyLoadingId] = useState("");

  useEffect(() => {
    setPageTitle("Discover Jobs | Skillify");
    return () => resetPageTitle();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [jobsPage]);

  const fetchJobs = async (overrides = {}) => {
    const effectiveJobsPage = overrides.jobsPage ?? jobsPage;
    const effectiveSkill = overrides.skill ?? searchSkill;

    setLoading(true);
    setError("");
    try {
      const response = await api.discoverJobs({
        page: effectiveJobsPage,
        limit: 8,
        skill: effectiveSkill,
      });

      if (response.success) {
        setJobs(response.data || []);
        setJobsTotalPages(response.pages || 1);
        setTotalJobs(response.total || 0);
      }
    } catch (err) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setJobsPage(1);
    fetchJobs({ jobsPage: 1, skill: searchSkill });
  };

  const handleClearFilters = () => {
    setSearchSkill("");
    setJobsPage(1);
    fetchJobs({ jobsPage: 1, skill: "" });
  };

  const handleApply = async (jobId) => {
    setApplyLoadingId(jobId);
    setError("");

    try {
      await api.applyToJob(jobId);
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? { ...job, hasApplied: true, applicationStatus: "pending" }
            : job,
        ),
      );
    } catch (err) {
      setError(err.message || "Failed to apply for this job");
    } finally {
      setApplyLoadingId("");
    }
  };

  if (loading && jobsPage === 1) return <LoadingSpinner />;

  return (
    <div className="page-wrap relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute top-60 left-0 w-[400px] h-[400px] bg-pink-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="page-container space-y-8 relative z-10">
        <section className="glass-card p-8 md:p-10 border border-white/60 bg-white/60 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Opportunities</span>
            </h1>
            <p className="text-lg font-medium text-slate-600 max-w-2xl mb-8">
              Explore freelance and open-source roles posted by our community of innovators and creators.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-4 flex flex-col md:flex-row gap-4 md:items-center"
            >
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                  type="text"
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  placeholder="Search by skill (React, Node.js, Design...)"
                  className="w-full rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm pl-13 pr-5 py-4 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium outline-none shadow-sm text-base"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary py-4 px-8 md:w-auto w-full shadow-indigo-500/25">
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn-secondary py-4 px-6 md:w-auto w-full"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-6 py-4 text-sm font-medium text-red-700 flex items-center gap-3 shadow-sm animate-fade-in-up">
             <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {error}
          </div>
        )}

        <section className="animate-fade-in">
          <div className="mb-6 flex items-center justify-between px-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
               <span className="flex h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
               Latest Jobs
            </h2>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-sm font-bold text-indigo-700 shadow-sm">
               {totalJobs} available
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="glass-card p-16 text-center border border-white/60">
              <div className="w-20 h-20 mx-auto bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">No jobs found</h3>
              <p className="text-slate-500 font-medium">We couldn't find any opportunities matching your current filter.</p>
              <button onClick={handleClearFilters} className="mt-6 font-bold text-white bg-indigo-600 px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">Clear filters to see all</button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 lg:grid-cols-2">
                {jobs.map((job, index) => (
                  <article key={job._id} className="group glass-card p-6 md:p-8 border border-white/60 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    
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
                             <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                             {job.postedBy?.name || "Unknown"}
                           </p>
                        </div>
                      </div>
                      
                      {job.applicationStatus && (
                        <span
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${statusClassMap[job.applicationStatus] || statusClassMap.pending}`}
                        >
                          {job.applicationStatus}
                        </span>
                      )}
                    </div>

                    <div className="my-5 flex-grow">
                       <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 font-medium">
                         {job.jobDetails}
                       </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(job.skillsRequired || []).map((skill) => (
                        <span
                          key={`${job._id}-${skill}`}
                          className="rounded-lg bg-indigo-50/80 px-3 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-100/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-indigo-100 p-1.5 rounded-lg"><svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                        <span className="font-semibold text-slate-900">{job.experienceRequired}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="bg-emerald-100 p-1.5 rounded-lg"><svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                        <span className="font-semibold text-slate-900">{job.salary || "Negotiable"}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="bg-purple-100 p-1.5 rounded-lg"><svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
                        <span className="font-semibold text-slate-900">{job.compensationType}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="bg-pink-100 p-1.5 rounded-lg"><svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                        <span className="font-semibold text-slate-900 text-xs tracking-tight">
                           {new Date(job.durationFrom).toLocaleDateString()} - {new Date(job.durationTo).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto border-t border-slate-100 lg:pt-6 pt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex-1">
                         {!job.hasApplied || job.applicationStatus === "withdrawn" ? (
                           <button
                             type="button"
                             onClick={() => handleApply(job._id)}
                             disabled={applyLoadingId === job._id}
                             className="btn-primary w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                           >
                             {applyLoadingId === job._id ? (
                               <span className="flex items-center justify-center gap-2">
                                 <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                 Applying
                               </span>
                             ) : "Apply Now"}
                           </button>
                         ) : (
                           <button
                             type="button"
                             disabled
                             className="btn-secondary w-full py-3 rounded-xl bg-slate-100/50 text-slate-400 border-slate-200/60 shadow-none font-bold"
                           >
                             Applied
                           </button>
                         )}
                      </div>

                      <div className="flex items-center gap-2">
                         {job.githubRepoUrl && (
                           <a
                             href={job.githubRepoUrl}
                             target="_blank"
                             rel="noreferrer"
                             className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm group/btn"
                             title="View Repository"
                           >
                             <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                           </a>
                         )}
                         {job.jobDescriptionDocument && (
                           <a
                             href={job.jobDescriptionDocument}
                             target="_blank"
                             rel="noreferrer"
                             className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm group/btn"
                             title="View Document"
                           >
                             <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                           </a>
                         )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {jobsTotalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-3xl border border-white/80 shadow-sm max-w-sm mx-auto">
                  <button
                    type="button"
                    onClick={() => setJobsPage((prev) => Math.max(1, prev - 1))}
                    disabled={jobsPage === 1}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <p className="text-sm font-bold text-slate-700 w-28 text-center uppercase tracking-wider">
                    Page <span className="text-indigo-600 text-base mx-1">{jobsPage}</span>/ {jobsTotalPages}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setJobsPage((prev) => Math.min(jobsTotalPages, prev + 1))
                    }
                    disabled={jobsPage === jobsTotalPages}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-600 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
