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
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute top-40 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="page-container space-y-8 relative z-10">
        <section className="glass-card p-8 md:p-10 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white shadow-xl shadow-indigo-900/20 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-sm mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Workspace</span>
            </div>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">{user?.name}</span>
            </h1>
            <p className="mt-4 text-lg text-indigo-100 max-w-2xl leading-relaxed">
              Manage your freelance profile, discover unparalleled opportunities, and track your applications in real-time.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="glass-card p-6 md:p-8 md:col-span-2 border border-white/60">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                 <div className="bg-indigo-100 p-2.5 rounded-2xl">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 </div>
                 <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                   Profile completion
                 </h2>
              </div>
              <span className="rounded-xl bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700 shadow-sm border border-indigo-100">
                {completion}%
              </span>
            </div>

            <div className="mt-6 h-4 w-full overflow-hidden rounded-full bg-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${completion}%` }}
              />
            </div>

            {missingFields.length > 0 ? (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 backdrop-blur-sm shadow-sm">
                <div className="flex gap-4">
                  <div className="bg-amber-100 p-2 rounded-xl flex-shrink-0 self-start">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-800 tracking-wide uppercase">
                      Complete these fields to boost visibility:
                    </h3>
                    <p className="mt-1 text-sm font-medium text-amber-700 leading-relaxed max-w-lg">
                      {missingFields.join(", ")}
                    </p>
                    <Link to="/complete-profile" className="btn-primary mt-4 py-2.5 px-6 text-sm">
                      Complete Profile
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 backdrop-blur-sm flex items-start gap-4 shadow-sm">
                <div className="bg-emerald-100 p-2.5 rounded-xl flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-800 tracking-wide uppercase mt-0.5">Profile is 100% complete</h3>
                  <p className="mt-1 text-sm font-medium text-emerald-700 max-w-lg">
                    Your profile is fully optimized and ready to attract top clients and collaborators.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6 md:p-8 border border-white/60">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4 mb-8">
               <div className="bg-purple-100 p-2.5 rounded-2xl">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
               </div>
               Quick stats
            </h2>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skills listed</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">
                    {user?.skills?.length || 0}
                  </p>
                  <span className="text-sm font-semibold text-slate-500">skills</span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">
                    {user?.yearsOfExperience || 0}
                  </p>
                  <span className="text-sm font-semibold text-slate-500">years</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card p-6 md:p-8 border border-white/60">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4 mb-8">
             <div className="bg-pink-100 p-2.5 rounded-2xl">
                <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             Quick actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/discover" className="group rounded-3xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 mb-5 shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Discover Jobs</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Browse open opportunities</p>
            </Link>
            
            <Link to="/publish-job" className="group rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 shadow-md shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-5 backdrop-blur-sm group-hover:scale-110 group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300 shadow-sm border border-white/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="font-bold text-white text-lg">Publish Job</h3>
              <p className="text-sm font-medium text-indigo-100 mt-1">Hire top talent easily</p>
            </Link>
            
            <Link to="/applications" className="group rounded-3xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 mb-5 shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Applications</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Track your progress</p>
            </Link>
            
            <Link to="/profile" className="group rounded-3xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300 mb-5 shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Edit Profile</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Update your info</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
