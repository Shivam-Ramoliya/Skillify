import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditProfileForm from "../components/profile/EditProfileForm";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function CompleteProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Complete Profile");
    return () => resetPageTitle();
  }, []);

  const handleSave = (response) => {
    updateUser(response.user);
    if (response.profileComplete) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600">
            Add your details to connect with others
          </p>
        </div>
        <EditProfileForm
          initialData={user}
          onSave={handleSave}
          submitLabel="Complete Profile"
        />
      </div>
    </div>
  );
}
