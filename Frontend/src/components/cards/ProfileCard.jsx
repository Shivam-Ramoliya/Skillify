import { Link } from "react-router-dom";

export default function ProfileCard({ user }) {
  return (
    <article className="group glass-card flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 border border-white/60">
      <div className="h-24 bg-gradient-to-r from-teal-500 to-cyan-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="-mt-10 px-6 pb-6 flex flex-col flex-grow relative z-10">
        <div className="flex items-end gap-3">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md bg-white group-hover:scale-105 transition-transform duration-300 relative z-20"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-teal-500 to-cyan-500 text-2xl font-black text-white shadow-md relative z-20 group-hover:scale-105 transition-transform duration-300">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className="pb-1">
            <h3 className="line-clamp-1 text-lg font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
              {user.name}
            </h3>
            {(user.currentRole || user.company) && (
              <p className="line-clamp-1 text-xs font-bold text-teal-600">
                {[user.currentRole, user.company].filter(Boolean).join(" at ")}
              </p>
            )}
          </div>
        </div>

        {user.location && (
          <p className="mt-4 text-sm font-medium text-slate-500 flex items-center gap-1.5">
             <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             {user.location}
          </p>
        )}

        {user.bio && (
          <p className="mt-3 line-clamp-2 text-sm font-medium leading-relaxed text-slate-600 flex-grow">
            {user.bio}
          </p>
        )}

        {user.skills?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            {user.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-teal-50/80 border border-teal-100/50 px-2.5 py-1 text-xs font-bold text-teal-700 shadow-sm"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="rounded-lg bg-slate-100/80 border border-slate-200/50 px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm">
                +{user.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <Link to={`/profile/${user._id}`} className="mt-5 w-full block text-center py-2.5 rounded-xl bg-white text-teal-700 font-bold border border-slate-200 shadow-sm hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 transition-all">
          View Profile
        </Link>
      </div>
    </article>
  );
}
