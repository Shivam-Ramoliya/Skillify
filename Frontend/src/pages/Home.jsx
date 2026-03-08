import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

const pillars = [
  {
    title: "Freelance-ready profiles",
    icon: (
      <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    ),
    description: "Showcase your expertise, experience, and project links so clients can trust you quickly and hire you seamlessly.",
  },
  {
    title: "Open project collaboration",
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    ),
    description: "Publish contribution opportunities and attract contributors by matching required skills and verified experience.",
  },
  {
    title: "Transparent applications",
    icon: (
      <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    description: "Track sent and received applications with clear status actions in one unified, clutter-free workspace.",
  },
];

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    setPageTitle("Skillify | Freelancer Network");
    return () => resetPageTitle();
  }, []);

  return (
    <div className="relative overflow-hidden w-full">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob pointer-events-none"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob pointer-events-none" style={{ animationDelay: '4s' }}></div>

      <div className="page-container relative z-10 pt-20 pb-32">
        {/* Hero Section */}
        <section className="text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border-indigo-100/50 shadow-sm mb-8">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Freelancer + Open Source Workspace</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Build your career by shipping <span className="text-gradient">real projects</span> with the right people
          </h1>
          
          <p className="mt-6 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Skillify helps freelancers and contributors discover opportunities, publish projects, and manage applications with a clean, professional workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10">
            {user ? (
              <>
                <Link to="/discover" className="btn-primary text-lg px-8 py-4 sm:w-auto w-full">
                  Discover Jobs
                </Link>
                <Link to="/publish-job" className="btn-secondary text-lg px-8 py-4 sm:w-auto w-full">
                  Publish a Job
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn-primary text-lg px-8 py-4 sm:w-auto w-full shadow-indigo-500/25">
                  Get Started for Free
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-4 sm:w-auto w-full">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Feature Grid / What you can do */}
        <section className="mt-32 max-w-6xl mx-auto px-4 relative z-20">
          <div className="glass-card p-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 relative z-10 border border-white/50">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/3">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Everything you need</h2>
                  <p className="text-slate-600 text-lg">
                    A powerful suite of tools designed to streamline your freelance operations from end to end.
                  </p>
                </div>
                <div className="md:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    "Publish global jobs",
                    "Apply instantly",
                    "Track real-time statuses",
                    "Manage rich profiles",
                    "Share your portfolio",
                    "Collaborate globally",
                  ].map((item, i) => (
                    <div
                      key={item}
                      className="glass-card bg-slate-50/50 px-5 py-4 text-sm font-semibold text-slate-800 flex items-center gap-3 hover:bg-white/80 transition-colors border border-slate-200/50 shadow-sm"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="mt-32 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Built for <span className="text-gradient">real workflows</span>
            </h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
              Everything is designed to keep hiring and collaboration simple, transparent, and remarkably fast.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <article key={pillar.title} className="glass-card-hover p-8 md:p-10 relative group overflow-hidden border border-white/60 bg-white/60">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6 border border-slate-100 group-hover:-translate-y-1 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="mt-32 max-w-5xl mx-auto px-4">
           <div className="relative rounded-[2.5rem] overflow-hidden glass-card border border-white/20 p-12 md:p-20 text-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10">
                 <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to elevate your freelance career?</h2>
                 <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                    Join thousands of professionals finding meaningful work and building extraordinary projects.
                 </p>
                 {user ? (
                   <Link to="/discover" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-indigo-900 bg-white hover:bg-indigo-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      Explore Opportunities Now
                   </Link>
                 ) : (
                   <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-indigo-900 bg-white hover:bg-indigo-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      Create Your Free Account
                   </Link>
                 )}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
