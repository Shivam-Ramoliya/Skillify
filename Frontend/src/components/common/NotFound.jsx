import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-wrap relative min-h-[calc(100vh-80px)] flex items-center justify-center py-10">
      {/* Decorative Background */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-red-300/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-300/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="page-container max-w-2xl relative z-10 w-full animate-fade-in-up">
        <div className="glass-card p-10 md:p-16 text-center border border-white/80 bg-white/80 shadow-2xl shadow-red-900/10 backdrop-blur-xl">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl flex items-center justify-center text-red-600 mb-8 border border-red-200/50 shadow-inner">
             <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="text-sm font-black uppercase tracking-widest text-red-500 mb-3">
            Error 404
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Page not found
          </h1>
          <p className="mt-5 text-lg font-medium text-slate-600 max-w-md mx-auto leading-relaxed">
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="mt-10">
            <Link to="/" className="inline-flex btn-primary px-8 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 font-bold text-lg shadow-xl shadow-red-500/20 border-0 transition-all hover:scale-105">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
