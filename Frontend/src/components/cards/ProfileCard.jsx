import { Link } from "react-router-dom";

export default function ProfileCard({ user }) {
  return (
    <article className="group glass-card flex h-full flex-col overflow-hidden hover:-translate-y-1 transition-all duration-200">
      <div
        className="h-24 relative overflow-hidden"
        style={{ backgroundColor: "var(--color-primary-500)" }}
      ></div>

      <div className="-mt-10 px-6 pb-6 flex flex-col flex-grow relative z-10">
        <div className="flex items-end gap-3">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="h-20 w-20 rounded-xl border-4 border-white object-cover shadow-sm bg-white group-hover:scale-105 transition-transform duration-200 relative z-20"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-xl border-4 border-white text-2xl font-bold text-white shadow-sm relative z-20 group-hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: "var(--color-primary-500)" }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className="pb-1">
            <h3
              className="line-clamp-1 text-lg font-bold transition-colors"
              style={{ color: "var(--color-neutral-900)" }}
            >
              {user.name}
            </h3>
            {(user.currentRole || user.company) && (
              <p
                className="line-clamp-1 text-xs font-semibold"
                style={{ color: "var(--color-primary-600)" }}
              >
                {[user.currentRole, user.company].filter(Boolean).join(" at ")}
              </p>
            )}
          </div>
        </div>

        {user.location && (
          <p
            className="mt-4 text-sm font-medium flex items-center gap-1.5"
            style={{ color: "var(--color-neutral-500)" }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: "var(--color-neutral-400)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {user.location}
          </p>
        )}

        {user.bio && (
          <p
            className="mt-3 line-clamp-2 text-sm font-medium leading-relaxed flex-grow"
            style={{ color: "var(--color-neutral-600)" }}
          >
            {user.bio}
          </p>
        )}

        {user.skills?.length > 0 && (
          <div
            className="mt-4 pt-4 flex flex-wrap gap-2"
            style={{ borderTop: "1px solid var(--color-neutral-100)" }}
          >
            {user.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-primary-50)",
                  color: "var(--color-primary-700)",
                  border: "1px solid var(--color-primary-100)",
                }}
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span
                className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-neutral-100)",
                  color: "var(--color-neutral-600)",
                  border: "1px solid var(--color-neutral-200)",
                }}
              >
                +{user.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <Link
          to={`/profile/${user._id}`}
          className="mt-5 w-full block text-center py-2.5 rounded-xl font-semibold transition-all"
          style={{
            backgroundColor: "white",
            color: "var(--color-primary-600)",
            border: "1px solid var(--color-neutral-200)",
          }}
        >
          View Profile
        </Link>
      </div>
    </article>
  );
}
