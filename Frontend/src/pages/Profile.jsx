import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [picturePreview, setPicturePreview] = useState(null);

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
        setPicturePreview(profileData.profilePicture || null);
        setFormData({
          bio: profileData.bio || "",
          location: profileData.location || "",
          profilePicture: profileData.profilePicture || "",
          resume: profileData.resume || "",
          availability: profileData.availability || "part-time",
          skillsOffered: profileData.skillsOffered?.join(", ") || "",
          skillsWanted: profileData.skillsWanted?.join(", ") || "",
        });
      }
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPicture(true);
    setError("");
    try {
      const response = await api.uploadProfilePicture(file);
      if (response.success) {
        setProfile({ ...profile, profilePicture: response.profilePicture });
        updateUser({ ...currentUser, profilePicture: response.profilePicture });
        setPicturePreview(response.profilePicture);
        setFormData({
          ...formData,
          profilePicture: response.profilePicture,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to upload profile picture");
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setError("");
    try {
      const response = await api.uploadResume(file);
      if (response.success) {
        setProfile({ ...profile, resume: response.resume });
        updateUser({ ...currentUser, resume: response.resume });
        setFormData({
          ...formData,
          resume: response.resume,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...formData,
        skillsOffered: formData.skillsOffered
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        skillsWanted: formData.skillsWanted
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };

      const response = await api.updateProfile(updateData);

      if (response.success) {
        setProfile(response.user);
        updateUser(response.user);
        setEditing(false);
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Profile Picture
                  </label>
                  <div className="flex gap-4 items-start">
                    {picturePreview && (
                      <div className="relative">
                        <img
                          src={picturePreview}
                          alt="Preview"
                          className="h-32 w-32 rounded-xl object-cover border-2 border-teal-200 shadow-md"
                        />
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          ✓ Current
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="editProfilePicture"
                        accept="image/*"
                        onChange={handlePictureUpload}
                        disabled={uploadingPicture}
                        className="hidden"
                      />
                      <label
                        htmlFor="editProfilePicture"
                        className="block w-full px-6 py-4 border-2 border-dashed border-teal-300 rounded-xl text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all duration-200"
                      >
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
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm font-semibold text-gray-700">
                          Click to upload new picture
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </label>
                      {uploadingPicture && (
                        <div className="mt-3 flex items-center gap-2 text-teal-600">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <p className="text-sm">Uploading picture...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Resume/Portfolio
                  </label>
                  {formData.resume && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 16.5a1 1 0 01-1-1V4a1 1 0 011-1h6a1 1 0 011 1v11.5a1 1 0 01-1 1H8zm6-11.5a.5.5 0 00-.5-.5h-5a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h5a.5.5 0 00.5-.5v-11z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p className="font-semibold text-green-900">
                              Resume uploaded ✓
                            </p>
                            <p className="text-xs text-green-700">
                              Click below to replace
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={formData.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                          >
                            👁️ View
                          </a>
                          <a
                            href={formData.resume}
                            download
                            className="px-3 py-1.5 bg-gray-600 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            ⬇️ Download
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    id="editResumeFile"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    className="hidden"
                  />
                  <label
                    htmlFor="editResumeFile"
                    className="block w-full px-6 py-4 border-2 border-dashed border-purple-300 rounded-xl text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                  >
                    <svg
                      className="w-8 h-8 text-purple-600 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm font-semibold text-gray-700">
                      Click to upload resume
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, TXT up to 50MB
                    </p>
                  </label>
                  {uploadingResume && (
                    <div className="mt-3 flex items-center gap-2 text-purple-600">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <p className="text-sm">Uploading resume...</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Skills Offered
                  </label>
                  <input
                    type="text"
                    name="skillsOffered"
                    value={formData.skillsOffered}
                    onChange={handleChange}
                    placeholder="e.g. Web Design, React, Photography"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                >
                  Save Changes
                </button>
              </form>
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
                      <a
                        href={profile.resume}
                        download
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
                      </a>
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
