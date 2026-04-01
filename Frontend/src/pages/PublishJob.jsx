import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function PublishJob() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    jobName: "",
    githubRepoUrl: "",
    jobDetails: "",
    skillsRequired: "",
    experienceRequired: "",
    compensationType: "paid",
    salary: "",
    durationFrom: "",
    durationTo: "",
    closingDate: "",
  });
  const [jobDescriptionDocument, setJobDescriptionDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isPublicProfile = user?.profileVisibility === "public";

  useEffect(() => {
    setPageTitle("Publish Job | Skillify");
    return () => resetPageTitle();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPublicProfile) { 
      setError("Set your profile visibility to Public to publish jobs.");
      return;
    }
    setError("");
    setSuccess("");

    // Client-side date validations
    if (formData.durationFrom && formData.durationTo && formData.durationFrom >= formData.durationTo) {
      setError("Job duration start date must be before the end date.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (formData.closingDate && formData.closingDate < today) {
      setError("Application closing date cannot be in the past.");
      return;
    }

    if (formData.closingDate && formData.durationFrom && formData.closingDate >= formData.durationFrom) {
      setError("Application closing date must be before the job start date.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        skillsRequired: formData.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await api.publishJob(payload, jobDescriptionDocument);
      if (response.success) {
        setSuccess("Job published successfully and is now active!");
        setFormData({
          jobName: "",
          githubRepoUrl: "",
          jobDetails: "",
          skillsRequired: "",
          experienceRequired: "",
          compensationType: "paid",
          salary: "",
          durationFrom: "",
          durationTo: "",
          closingDate: "",
        });
        setJobDescriptionDocument(null);
      }
    } catch (err) {
      setError(err.message || "Failed to publish job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap relative">
      {/* Decorative Background */}
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="page-container relative z-10">
        <section className="glass-card p-8 md:p-12 border border-slate-200/60 bg-white shadow-xl">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
               <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Publish a <span className="text-blue-600">Job</span></h1>
            <p className="text-lg font-medium text-slate-600 max-w-2xl mx-auto">
              Create a high-quality listing to attract the best freelancers and open contributors.
            </p>
          </div>

          {!isPublicProfile ? (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-6 py-4 text-sm font-medium text-red-700 flex items-center gap-3 shadow-sm animate-fade-in-up">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Your profile is private. Switch visibility to Public from your profile page to publish jobs.
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-8 rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-6 py-4 text-sm font-medium text-red-700 flex items-center gap-3 shadow-sm animate-fade-in-up">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 backdrop-blur-sm px-6 py-4 text-sm font-medium text-emerald-700 flex items-center gap-3 shadow-sm animate-fade-in-up">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
             <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-200 pb-4">
                     <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                    Basic Details
                 </h2>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Job Name *
                  </label>
                  <input
                    type="text"
                    name="jobName"
                    value={formData.jobName}
                    onChange={handleChange}
                    required
                    className="input-base bg-white"
                    placeholder="e.g. Frontend Developer for SaaS Dashboard"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Work GitHub Repo (optional)
                  </label>
                  <input
                    type="url"
                    name="githubRepoUrl"
                    value={formData.githubRepoUrl}
                    onChange={handleChange}
                    className="input-base bg-white"
                    placeholder="https://github.com/org/repo"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Specific Job Details *
                  </label>
                  <textarea
                    name="jobDetails"
                    value={formData.jobDetails}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input-base bg-white resize-y"
                    placeholder="Describe the scope, responsibilities, and expected outcomes..."
                  />
                </div>
             </div>

            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-200 pb-4">
                   <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
                   Requirements
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Skills Required *
                    </label>
                    <input
                      type="text"
                      name="skillsRequired"
                      value={formData.skillsRequired}
                      onChange={handleChange}
                      required
                      className="input-base bg-white"
                      placeholder="React, TypeScript, API integration"
                    />
                    <p className="text-xs text-slate-500 mt-2 font-medium">Comma separated list of skills.</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Experience Required *
                    </label>
                    <input
                      type="text"
                      name="experienceRequired"
                      value={formData.experienceRequired}
                      onChange={handleChange}
                      required
                      className="input-base bg-white"
                      placeholder="e.g. 2+ years"
                    />
                  </div>
                </div>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-200 pb-4">
                   <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">3</span>
                   Terms & Attachments
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Compensation *
                    </label>
                    <div className="relative">
                      <select
                        name="compensationType"
                        value={formData.compensationType}
                        onChange={handleChange}
                        className="input-base bg-white appearance-none pr-10"
                        required
                      >
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid / Open Source Contribution</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Salary {" "}
                      {formData.compensationType === "paid" ? <span className="text-blue-600">*</span> : <span className="text-slate-400 font-medium">(optional)</span>}
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      required={formData.compensationType === "paid"}
                      disabled={formData.compensationType === "unpaid"}
                      className="input-base bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                      placeholder={formData.compensationType === "paid" ? "e.g. ₹40,000/month or $50/hr" : "Not applicable"}
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Job Duration From *
                    </label>
                    <input
                      type="date"
                      name="durationFrom"
                      value={formData.durationFrom}
                      onChange={handleChange}
                      required
                      className="input-base bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Job Duration To *
                    </label>
                    <input
                      type="date"
                      name="durationTo"
                      value={formData.durationTo}
                      onChange={handleChange}
                      required
                      className="input-base bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Applications Closing Date *
                    </label>
                    <input
                      type="date"
                      name="closingDate"
                      value={formData.closingDate}
                      onChange={handleChange}
                      required
                      className="input-base bg-white border-error-200 focus:border-error-500 focus:ring-error-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Job Description Document (optional)
                  </label>
                  <div className="relative mt-2 flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-white/50 hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                              <p className="mb-1 text-sm text-slate-500 font-semibold"><span className="font-bold text-blue-600">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-slate-500 font-medium">PDF, DOCX, TXT, or MD (MAX 5MB)</p>
                          </div>
                          <input 
                             type="file" 
                             className="hidden" 
                             accept=".pdf,.doc,.docx,.txt,.md"
                             onChange={(e) => setJobDescriptionDocument(e.target.files?.[0] || null)}
                          />
                      </label>
                  </div>
                  {jobDescriptionDocument && (
                    <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
                       <div className="flex items-center gap-3">
                          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <span className="text-sm font-bold text-blue-900">{jobDescriptionDocument.name}</span>
                       </div>
                       <button type="button" onClick={() => setJobDescriptionDocument(null)} className="text-blue-400 hover:text-rose-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                    </div>
                  )}
                </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg font-extrabold tracking-wide uppercase shadow-xl shadow-blue-500/20 group"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white/90" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Publishing to Network...
                    </>
                  ) : (
                    <>
                      Publish Job Now
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </span>
              </button>
              <p className="text-center text-xs text-slate-500 font-medium mt-4">By publishing, you agree to our terms of service.</p>
            </div>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
