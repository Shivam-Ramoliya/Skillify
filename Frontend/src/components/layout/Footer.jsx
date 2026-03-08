import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/60 bg-white/40 backdrop-blur-lg py-8">
      <div className="page-container px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <Link to="/" className="mb-4 flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <img
               src="/Skillify.png"
               alt="Skillify"
               className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-80"
             />
             <span className="relative z-10 text-xl font-bold text-white tracking-tighter">S</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900">Skillify</h3>
        </Link>
        <p className="text-sm text-center leading-relaxed text-slate-500 max-w-md mb-8">
          Built for freelancers and open project contributors to discover
          work, collaborate faster, and ship meaningful outcomes with modern tools.
        </p>

        <div className="w-full max-w-md border-t border-slate-200/60 pt-6 flex flex-col items-center justify-center gap-2 text-sm text-slate-400 md:flex-row md:justify-between">
          <p>© {currentYear} Skillify. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <span className="text-pink-500 text-lg leading-none">♥</span> for freelancers
          </p>
        </div>
      </div>
    </footer>
  );
}
