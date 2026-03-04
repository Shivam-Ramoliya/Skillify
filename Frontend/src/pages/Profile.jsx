import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EditProfileForm from "../components/profile/EditProfileForm";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUserId;

  useEffect(() => {
    if (profile) {
      setPageTitle(profile.name || "Profile");
    }
    return () => resetPageTitle();
  }, [profile]);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = isOwnProfile
        ? await api.getMyProfile()
        : await api.getUserProfile(userId);

      if (response.success) {
        const profileData = response.data || response.user;
        setProfile(profileData);
      }
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = (response) => {
    setProfile(response.user);
    updateUser(response.user);
    setEditing(false);
  };

  const handleResumeDownload = async () => {
    if (!profile?.resume) return;
    try {
      const response = await fetch(profile.resume);
      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const parts = profile.resume.split("/");
      link.download = parts[parts.length - 1] || "resume";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err.message || "Failed to download resume");
    }
  };

  const toggleVisibility = async () => {
    try {
      const nextVisibility =
        profile.profileVisibility === "public" ? "private" : "public";
      const response = await api.updateProfileVisibility(nextVisibility);
      if (response.success) {
        setProfile({
          ...profile,
          profileVisibility: response.profileVisibility,
        });
        updateUser({
          ...currentUser,
          profileVisibility: response.profileVisibility,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to update visibility");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !profile)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-teal-600 to-teal-500 h-32"></div>

          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-teal-500 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <p className="text-gray-600">{profile.location}</p>
                <p className="text-sm text-amber-600 font-semibold mt-1">
                  {(profile.averageRating || 0).toFixed(1)} stars (
                  {profile.totalConnectionsCount ||
                    profile.connectionCount ||
                    profile.connections?.length ||
                    0}{" "}
                  Connections)
                </p>
                {isOwnProfile && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setEditing(!editing)}
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                      {editing ? "Cancel" : "Edit Profile"}
                    </button>
                    <button
                      onClick={toggleVisibility}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      {profile.profileVisibility === "public"
                        ? "Make Private"
                        : "Make Public"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editing && isOwnProfile ? (
              <EditProfileForm
                initialData={profile}
                onSave={handleEditSave}
                onCancel={() => setEditing(false)}
                submitLabel="Save Changes"
              />
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    About
                  </h2>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Availability
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      profile.availability === "full-time"
                        ? "bg-green-100 text-green-800"
                        : profile.availability === "part-time"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {profile.availability}
                  </span>
                </div>

                {profile.skillsOffered?.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Skills Offered
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.skillsOffered.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.skillsWanted?.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Skills Wanted
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.skillsWanted.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.resume && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Resume/Portfolio
                    </h2>
                    <div className="flex gap-3">
                      <a
                        href={profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Resume
                      </a>
                      <button
                        type="button"
                        onClick={handleResumeDownload}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
