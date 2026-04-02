import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";
import { motion } from "framer-motion";
import {
  Search,
  Info,
  DollarSign,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  AlertCircle,
  Clock,
  User,
} from "lucide-react";

// GitHub icon component
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const statusStyles = {
  pending: {
    bg: "var(--color-warning-50)",
    text: "var(--color-warning-700)",
    border: "var(--color-warning-100)",
  },
  accepted: {
    bg: "var(--color-accent-50)",
    text: "var(--color-accent-700)",
    border: "var(--color-accent-200)",
  },
  rejected: {
    bg: "var(--color-error-50)",
    text: "var(--color-error-700)",
    border: "var(--color-error-100)",
  },
  withdrawn: {
    bg: "var(--color-neutral-100)",
    text: "var(--color-neutral-600)",
    border: "var(--color-neutral-200)",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function Discover() {
  const { user } = useAuth();
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

  const isPublicProfile = user?.profileVisibility === "public";

  useEffect(() => {
    if (!isPublicProfile) {
      setLoading(false);
      setError(
        "Set your profile visibility to Public to discover and apply for jobs.",
      );
      setJobs([]);
      setTotalJobs(0);
      setJobsTotalPages(1);
      return;
    }
    fetchJobs();
  }, [jobsPage, isPublicProfile]);

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
    if (!isPublicProfile) return;
    setJobsPage(1);
    fetchJobs({ jobsPage: 1, skill: searchSkill });
  };

  const handleClearFilters = () => {
    if (!isPublicProfile) return;
    setSearchSkill("");
    setJobsPage(1);
    fetchJobs({ jobsPage: 1, skill: "" });
  };

  const handleApply = async (jobId) => {
    if (!isPublicProfile) {
      setError("Set your profile visibility to Public to apply for jobs.");
      return;
    }
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
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob pointer-events-none"></div>
      <div
        className="absolute top-60 right-10 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob pointer-events-none"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="page-container space-y-8 relative z-10">
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-neutral-900">
              Discover <span className="text-gradient">Opportunities</span>
            </h1>
            <p className="text-lg font-medium max-w-2xl mb-8 text-neutral-600">
              Explore freelance and open-source roles posted by our community of
              innovators and creators.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-4 flex flex-col md:flex-row gap-4 md:items-center"
            >
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  placeholder="Search by skill (React, Node.js, Design...)"
                  className="input-base pl-14 py-4 text-base w-full shadow-sm"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary py-4 px-8 md:w-auto w-full shadow-md"
                >
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
        </motion.section>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert-error flex items-center gap-3 shadow-md"
          >
            <AlertCircle className="w-5 h-5 text-error-500" />
            <span className="font-semibold">{error}</span>
          </motion.div>
        )}

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-8 flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-neutral-900">
              <span className="flex h-3 w-3 rounded-full bg-accent-500 shadow-sm animate-pulse"></span>
              Latest Jobs
            </h2>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary-50 text-primary-700 border border-primary-100 shadow-sm">
              {totalJobs} available
            </div>
          </div>

          {jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-16 text-center shadow-lg"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 bg-neutral-100 text-neutral-400 shadow-sm">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-2 text-neutral-900">
                No jobs found
              </h3>
              <p className="font-medium text-neutral-500 mb-6 max-w-md mx-auto">
                We couldn't find any opportunities matching your current filter.
                Try adjusting your search criteria.
              </p>
              <button
                onClick={handleClearFilters}
                className="btn-primary shadow-md"
              >
                Clear filters to see all
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 lg:grid-cols-2"
              >
                {jobs.map((job) => (
                  <motion.article
                    variants={cardVariants}
                    key={job._id}
                    className="group glass-card-hover p-6 md:p-8 relative overflow-hidden flex flex-col h-full shadow-md"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white bg-primary-50 text-primary-600 border border-primary-200 shadow-sm">
                          {job.jobName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold transition-colors line-clamp-1 text-neutral-900 group-hover:text-primary-600">
                            {job.jobName}
                          </h3>
                          <p className="mt-1 text-sm font-semibold flex items-center gap-1.5 text-neutral-500">
                            <Briefcase className="w-4 h-4 text-primary-400" />
                            {job.postedBy?.name || "Unknown"}
                          </p>
                        </div>
                      </div>

                      {job.applicationStatus && (
                        <span
                          className="rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm"
                          style={{
                            backgroundColor:
                              statusStyles[job.applicationStatus]?.bg ||
                              statusStyles.pending.bg,
                            color:
                              statusStyles[job.applicationStatus]?.text ||
                              statusStyles.pending.text,
                            border: `1px solid ${statusStyles[job.applicationStatus]?.border || statusStyles.pending.border}`,
                          }}
                        >
                          {job.applicationStatus}
                        </span>
                      )}
                    </div>

                    {/* Posted and Closes dates */}
                    <div className="flex items-center gap-4 mb-4 ml-16 text-sm">
                      {job.createdAt && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="font-medium">Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      )}
                      {job.closingDate && (
                        <div className="flex items-center gap-1.5 text-red-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-semibold">Closes {new Date(job.closingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4 flex-grow">
                      <p className="line-clamp-2 text-sm leading-relaxed font-medium text-neutral-600">
                        {job.jobDetails}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {(job.skillsRequired || []).map((skill) => (
                        <span
                          key={`${job._id}-${skill}`}
                          className="rounded-lg px-3 py-1.5 text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Info grid — labeled fields */}
                    <div className="grid gap-3 text-sm sm:grid-cols-2 p-4 rounded-2xl mb-5 bg-slate-50/50 border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-blue-100 p-1.5 rounded-lg">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Experience</p>
                          <p className="font-semibold text-slate-900 text-sm">{job.experienceRequired || "Any"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="bg-emerald-100 p-1.5 rounded-lg">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Salary</p>
                          <p className="font-semibold text-slate-900 text-sm">{job.salary || "Unpaid"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="bg-violet-100 p-1.5 rounded-lg">
                          <Info className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Type</p>
                          <p className="font-semibold text-slate-900 text-sm capitalize">{job.compensationType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="bg-amber-100 p-1.5 rounded-lg">
                          <Calendar className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Duration</p>
                          <p className="font-semibold text-slate-900 text-xs">{new Date(job.durationFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(job.durationTo).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
                      <div className="flex-1">
                        {!job.hasApplied ||
                        job.applicationStatus === "withdrawn" ? (
                          <button
                            type="button"
                            onClick={() => handleApply(job._id)}
                            disabled={applyLoadingId === job._id}
                            className="btn-primary w-full py-3 shadow-md"
                          >
                            {applyLoadingId === job._id ? (
                              <span className="flex items-center justify-center gap-2">
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
                                Applying
                              </span>
                            ) : (
                              "Apply Now"
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="btn-secondary w-full py-3 opacity-50 cursor-not-allowed"
                          >
                            Applied
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {job.postedBy?._id && (
                          <Link
                            to={`/profile/${job.postedBy._id}`}
                            className="p-3 rounded-xl bg-white border border-neutral-200 text-neutral-600 shadow-sm hover:border-primary-300 hover:text-primary-600 transition-all"
                            title={`View ${job.postedBy?.name || 'Employer'}'s Profile`}
                          >
                            <User className="w-5 h-5 transition-transform hover:scale-110" />
                          </Link>
                        )}
                        {job.githubRepoUrl && (
                          <a
                            href={job.githubRepoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 rounded-xl bg-white border border-neutral-200 text-neutral-600 shadow-sm hover:border-primary-300 hover:text-primary-600 transition-all"
                            title="View Repository"
                          >
                            <GithubIcon className="w-5 h-5 transition-transform hover:scale-110" />
                          </a>
                        )}
                        {job.jobDescriptionDocument && (
                          <a
                            href={job.jobDescriptionDocument}
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 rounded-xl bg-white border border-neutral-200 text-neutral-600 shadow-sm hover:border-primary-300 hover:text-primary-600 transition-all"
                            title="View Document"
                          >
                            <FileText className="w-5 h-5 transition-transform hover:scale-110" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              {jobsTotalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-12 flex items-center justify-center gap-4 p-4 rounded-2xl max-w-sm mx-auto bg-white border border-neutral-200 shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => setJobsPage((prev) => Math.max(1, prev - 1))}
                    disabled={jobsPage === 1}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <p className="text-sm font-bold w-28 text-center uppercase tracking-wider text-neutral-700">
                    Page{" "}
                    <span className="text-base mx-1 text-primary-600">
                      {jobsPage}
                    </span>
                    / {jobsTotalPages}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setJobsPage((prev) => Math.min(jobsTotalPages, prev + 1))
                    }
                    disabled={jobsPage === jobsTotalPages}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
}
