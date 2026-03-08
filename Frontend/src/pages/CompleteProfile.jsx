import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditProfileForm from "../components/profile/EditProfileForm";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function CompleteProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Complete Profile | Skillify");
    return () => resetPageTitle();
  }, []);

  const handleSave = (response) => {
    updateUser(response.user);
    if (response.profileComplete) navigate("/dashboard");
  };

  return (
    <div className="page-wrap relative flex items-center justify-center py-10 min-h-[calc(100vh-80px)]">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-300/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none z-0"></div>
      <div className="absolute top-60 left-0 w-[400px] h-[400px] bg-cyan-300/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

      <div className="page-container max-w-4xl relative z-10 w-full animate-fade-in-up">
        <section className="glass-card p-6 md:p-10 border border-white/80 bg-white/80 shadow-2xl shadow-teal-900/10 backdrop-blur-xl rounded-3xl">
          <div className="text-center mb-10 border-b border-slate-200 pb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-500/30 border border-white/20">
               <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Complete your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Profile</span></h1>
            <p className="mt-4 text-lg font-medium text-slate-600">
              Add your details so clients and collaborators can evaluate you confidently.
            </p>
          </div>
          
          <div className="bg-slate-50/50 p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm relative z-10">
            <EditProfileForm
              initialData={user}
              onSave={handleSave}
              submitLabel="Save & Complete Profile"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
