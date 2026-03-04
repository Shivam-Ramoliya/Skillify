import { Link } from "react-router-dom";

export default function ProfileCard({
  user,
  onSendRequest,
  isRequesting = false,
}) {
  const renderConnectionAction = () => {
    if (user.connectionStatus === "connected") {
      return (
        <div className="mt-2 w-full text-center px-4 py-2 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm font-semibold">
          Connected
        </div>
      );
    }

    if (user.connectionStatus === "request_sent") {
      return (
        <div className="mt-2 w-full text-center px-4 py-2 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-700 text-sm font-semibold">
          Request Sent
        </div>
      );
    }

    if (user.connectionStatus === "request_received") {
      return (
        <Link
          to="/connections"
          className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 text-sm font-semibold hover:bg-teal-100"
        >
          Respond in Connections
        </Link>
      );
    }

    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSendRequest?.(user._id);
        }}
        disabled={isRequesting}
        className="mt-2 w-full bg-white border border-teal-300 text-teal-700 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 disabled:opacity-50"
      >
        {isRequesting ? "Sending..." : "Connect"}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:translate-y-[-4px] h-full flex flex-col">
      {/* Header Background */}
      <div className="h-20 bg-gradient-to-r from-teal-500 to-cyan-500"></div>

      {/* Profile Content */}
      <div className="px-6 pb-6 flex flex-col flex-grow">
        {/* Profile Picture & Name */}
        <div className="flex items-end gap-4 mb-4 -mt-10 relative z-10">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 pb-2">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {user.name}
            </h3>
            {user.location && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {user.location}
              </p>
            )}
          </div>
        </div>

        {/* Availability Badge */}
        {user.availability && user.availability !== "not available" && (
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                user.availability === "full-time"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {user.availability === "full-time"
                ? "🟢 Full-time"
                : "🔵 Part-time"}
            </span>
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Skills Offered */}
        {user.skillsOffered?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">Offers:</p>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsOffered.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-200"
                >
                  {skill}
                </span>
              ))}
              {user.skillsOffered.length > 3 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{user.skillsOffered.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Skills Wanted */}
        {user.skillsWanted?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Wants to learn:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsWanted.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200"
                >
                  {skill}
                </span>
              ))}
              {user.skillsWanted.length > 3 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{user.skillsWanted.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Link
          to={`/profile/${user._id}`}
          className="mt-auto w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 9l3 3L8 20H5v-3l12-12z"
            />
          </svg>
          View Profile
        </Link>
        {renderConnectionAction()}
      </div>
    </div>
  );
}
