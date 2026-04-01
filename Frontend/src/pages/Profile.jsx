import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EditProfileForm from "../components/profile/EditProfileForm";
import DeleteAccountModal from "../components/profile/DeleteAccountModal";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUserId;

  useEffect(() => {
    if (profile) setPageTitle(`${profile.name} | Skillify`);
    return () => resetPageTitle();
  }, [profile]);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
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

  const toggleVisibility = async () => {
    try {
      const nextVisibility =
        profile.profileVisibility === "public" ? "private" : "public";
      const response = await api.updateProfileVisibility(nextVisibility);
      if (response.success) {
        const updated = {
          ...profile,
          profileVisibility: response.profileVisibility,
        };
        setProfile(updated);
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
  if (error && !profile) {
    return (
      <div className="page-wrap relative">
        <div className="page-container relative z-10">
          <div className="rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-6 py-4 text-red-700 flex items-center gap-3 font-medium shadow-sm">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute top-60 left-0 w-[400px] h-[400px] bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="page-container max-w-5xl space-y-8 relative z-10">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-6 py-4 text-sm font-medium text-red-700 flex items-center gap-3 shadow-sm animate-fade-in-up">
             <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {error}
          </div>
        )}

        <section className="glass-card overflow-hidden border border-slate-200/60 bg-white shadow-xl transition-all duration-300">
          <div className="h-40 bg-blue-600 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          </div>
          <div className="px-6 md:px-10 pb-8">
            <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="h-32 w-32 rounded-3xl border-4 border-white object-cover shadow-lg shadow-blue-500/20 bg-white"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-white bg-blue-600 text-5xl font-black text-white shadow-lg shadow-blue-500/20">
                    {profile.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <div className="mb-2">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {profile.name}
                  </h1>
                  {(profile.currentRole || profile.company) && (
                    <p className="text-base font-semibold text-blue-700 mt-1">
                      {[profile.currentRole, profile.company]
                        .filter(Boolean)
                        .join(" at ")}
                    </p>
                  )}
                  {profile.location && (
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {profile.location}
                    </p>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <div className="flex flex-wrap gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setEditing((prev) => !prev)}
                    className="btn-primary py-2.5 px-6 bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                  >
                    {editing ? "Cancel Editing" : "Edit Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="btn-secondary py-2.5 px-6 font-bold flex items-center gap-2 bg-white/80 border-slate-200"
                  >
                    {profile.profileVisibility === "public" ? (
                      <>
                        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        Make Private
                      </>
                    ) : (
                      <>
                         <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                         Make Public
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {editing && isOwnProfile ? (
          <section className="glass-card p-6 md:p-8 animate-fade-in border border-white/60">
            <EditProfileForm
              initialData={profile}
              onSave={handleEditSave}
              onCancel={() => setEditing(false)}
              submitLabel="Save Changes"
            />
          </section>
        ) : (
          <section className="grid gap-8 lg:grid-cols-3 animate-fade-in">
            <div className="space-y-8 lg:col-span-2">
              <article className="glass-card p-6 md:p-8 border border-white/60">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                  About
                </h2>
                <p className="text-base font-medium leading-relaxed text-slate-600 whitespace-pre-line">
                  {profile.bio || "No bio provided yet."}
                </p>
              </article>

              {profile.experience && (
                <article className="glass-card p-6 md:p-8 border border-white/60">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                     <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                    Experience
                  </h2>
                  <p className="whitespace-pre-line text-base font-medium leading-relaxed text-slate-600">
                    {profile.experience}
                  </p>
                </article>
              )}

              {profile.education && (
                <article className="glass-card p-6 md:p-8 border border-white/60">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                     <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg></div>
                    Education
                  </h2>
                  <p className="whitespace-pre-line text-base font-medium leading-relaxed text-slate-600">
                    {profile.education}
                  </p>
                </article>
              )}
            </div>

            <div className="space-y-8">
              <article className="glass-card p-6 md:p-8 border border-white/60">
                <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                  Overview
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Availability</p>
                    <p className="text-sm font-semibold text-slate-800 capitalize bg-slate-100 inline-block px-3 py-1.5 rounded-lg border border-slate-200/50">
                      {profile.availability || "Not specified"}
                    </p>
                  </div>
                  {typeof profile.yearsOfExperience === "number" && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                      <p className="text-sm font-semibold text-slate-800 bg-slate-100 inline-block px-3 py-1.5 rounded-lg border border-slate-200/50">
                        {profile.yearsOfExperience}+ years
                      </p>
                    </div>
                  )}
                </div>
              </article>

              {profile.skills?.length > 0 && (
                <article className="glass-card p-6 md:p-8 border border-white/60">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                    Top Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-xl bg-blue-50 border border-blue-100/50 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              )}

              {(profile.githubUrl ||
                profile.linkedinUrl ||
                profile.portfolioUrl) && (
                <article className="glass-card p-6 md:p-8 border border-white/60">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                    Links & Social
                  </h2>
                  <div className="flex flex-col gap-3">
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all text-slate-700 font-semibold text-sm group shadow-sm"
                      >
                        <svg className="w-5 h-5 text-slate-600 group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        GitHub Profile
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all text-slate-700 font-semibold text-sm group shadow-sm"
                      >
                         <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        LinkedIn Profile
                      </a>
                    )}
                    {profile.portfolioUrl && (
                      <a
                        href={profile.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all text-slate-700 font-semibold text-sm group shadow-sm"
                      >
                        <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        Personal Portfolio
                      </a>
                    )}
                  </div>
                </article>
              )}

              {profile.resume && (
                <article className="glass-card p-6 md:p-8 border border-white/60">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                     <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    Resume
                  </h2>
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center py-3.5 bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  >
                    View / Download Resume
                  </a>
                </article>
              )}
            </div>
          </section>
        )}

        {/* Danger Zone — own profile only, not editing */}
        {isOwnProfile && !editing && (
          <section className="glass-card p-6 md:p-8 border border-red-200/60 bg-white/70 animate-fade-in">
            <h2 className="text-xl font-bold text-red-700 flex items-center gap-3 border-b border-red-100 pb-4 mb-4">
              <div className="bg-red-100 p-2 rounded-xl text-red-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              Danger Zone
            </h2>
            <p className="text-sm text-slate-600 font-medium mb-5 leading-relaxed">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              type="button"
              id="btn-delete-account"
              onClick={() => setShowDeleteModal(true)}
              className="btn-danger py-2.5 px-6 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete Account
            </button>
          </section>
        )}
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
}
