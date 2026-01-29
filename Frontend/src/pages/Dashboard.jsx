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
    setPageTitle("Dashboard");
    return () => resetPageTitle();
  }, []);

  useEffect(() => {
    fetchProfileStatus();
  }, []);

  const fetchProfileStatus = async () => {
    try {
      const response = await api.getProfileStatus();
      if (response.success) {
        setProfileStatus(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch profile status:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            <span className="text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text">
              {user?.name}!
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Here's your profile overview and quick actions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Completion Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Profile Completion
            </h3>
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-teal-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${profileStatus?.completionPercentage || 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {profileStatus?.completionPercentage || 0}% Complete
            </p>
            {profileStatus && !profileStatus.profileComplete && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Missing fields:</p>
                <ul className="text-sm text-red-600 list-disc list-inside">
                  {profileStatus.missingFields?.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
                <Link
                  to="/complete-profile"
                  className="mt-3 block text-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                >
                  Complete Profile
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Skills Offered
            </h3>
            <p className="text-3xl font-bold text-teal-600">
              {user?.skillsOffered?.length || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Skills you can teach</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Skills Wanted
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {user?.skillsWanted?.length || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Skills you want to learn
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/discover"
              className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              <div className="text-center">
                <svg
                  className="w-8 h-8 text-teal-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="font-semibold text-gray-700">
                  Discover People
                </span>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              <div className="text-center">
                <svg
                  className="w-8 h-8 text-teal-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-semibold text-gray-700">
                  View Profile
                </span>
              </div>
            </Link>

            <Link
              to="/complete-profile"
              className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              <div className="text-center">
                <svg
                  className="w-8 h-8 text-teal-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="font-semibold text-gray-700">
                  Edit Profile
                </span>
              </div>
            </Link>

            <div className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg">
              <div className="text-center">
                <div
                  className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    user?.profileVisibility === "public"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm font-semibold text-gray-700">
                  Profile{" "}
                  {user?.profileVisibility === "public" ? "Public" : "Private"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Overview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Skills
            </h2>
            {user?.skillsOffered && user.skillsOffered.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No skills added yet</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Want to Learn
            </h2>
            {user?.skillsWanted && user.skillsWanted.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No skills added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
