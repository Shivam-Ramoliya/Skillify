export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="glass-card flex flex-col items-center gap-4 px-10 py-8 bg-white/60 shadow-xl shadow-teal-900/5 animate-fade-in border border-white/60">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-4 border-teal-100"></div>
          <div className="absolute top-0 left-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-teal-600 border-r-teal-500"></div>
        </div>
        <p className="text-base font-bold text-teal-800 animate-pulse tracking-wide">
          Loading workspace...
        </p>
      </div>
    </div>
  );
}
