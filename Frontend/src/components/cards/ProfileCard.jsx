import { Link } from "react-router-dom";

export default function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center text-xl font-bold">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.location}</p>
        </div>
      </div>

      {user.bio && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{user.bio}</p>
      )}

      {user.skillsOffered?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {user.skillsOffered.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <Link
        to={`/profile/${user._id}`}
        className="mt-auto text-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
      >
        View Profile
      </Link>
    </div>
  );
}
