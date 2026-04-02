import { useEffect, useMemo, useState } from "react";
import { City, Country, State } from "country-state-city";
import { api } from "../../utils/api";

export default function EditProfileForm({
  initialData,
  onSave,
  onCancel,
  submitLabel = "Save Changes",
}) {
  const [formData, setFormData] = useState({
    bio: initialData?.bio || "",
    location: initialData?.location || "",
    profilePicture: initialData?.profilePicture || "",
    resume: initialData?.resume || "",
    availability: initialData?.availability || "part-time",
    education: Array.isArray(initialData?.education) ? initialData.education : [],
    experience: Array.isArray(initialData?.experience) ? initialData.experience : [],
    yearsOfExperience: initialData?.yearsOfExperience ?? 0,
    currentRole: initialData?.currentRole || "",
    company: initialData?.company || "",
    skills: Array.isArray(initialData?.skills)
      ? initialData.skills.join(", ")
      : initialData?.skills || "",
    githubUrl: initialData?.githubUrl || "",
    linkedinUrl: initialData?.linkedinUrl || "",
    portfolioUrl: initialData?.portfolioUrl || "",
    profileVisibility: initialData?.profileVisibility || "private",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [picturePreview, setPicturePreview] = useState(
    initialData?.profilePicture || null,
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(
    () =>
      selectedCountryCode ? State.getStatesOfCountry(selectedCountryCode) : [],
    [selectedCountryCode],
  );
  const cities = useMemo(() => {
    if (!selectedCountryCode) return [];

    if (selectedStateCode) {
      return (
        City.getCitiesOfState(selectedCountryCode, selectedStateCode) || []
      );
    }

    if (typeof City.getCitiesOfCountry === "function") {
      return City.getCitiesOfCountry(selectedCountryCode) || [];
    }

    return [];
  }, [selectedCountryCode, selectedStateCode]);

  useEffect(() => {
    if (!initialData?.location || !countries.length) return;

    const parts = initialData.location
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    let cityName = "";
    let stateName = "";
    let countryName = "";

    if (parts.length >= 3) {
      cityName = parts[0];
      stateName = parts[1];
      countryName = parts.slice(2).join(", ");
    } else if (parts.length === 2) {
      cityName = parts[0];
      countryName = parts[1];
    } else {
      countryName = parts[0] || "";
    }

    const matchedCountry = countries.find(
      (country) => country.name.toLowerCase() === countryName.toLowerCase(),
    );

    if (!matchedCountry) return;

    setSelectedCountryCode(matchedCountry.isoCode);

    const statesOfCountry =
      State.getStatesOfCountry(matchedCountry.isoCode) || [];
    const matchedState = stateName
      ? statesOfCountry.find(
          (state) => state.name.toLowerCase() === stateName.toLowerCase(),
        )
      : null;

    if (matchedState) {
      setSelectedStateCode(matchedState.isoCode);
    }

    const availableCities = matchedState
      ? City.getCitiesOfState(matchedCountry.isoCode, matchedState.isoCode) ||
        []
      : typeof City.getCitiesOfCountry === "function"
        ? City.getCitiesOfCountry(matchedCountry.isoCode) || []
        : [];

    const matchedCity = cityName
      ? availableCities.find(
          (city) => city.name.toLowerCase() === cityName.toLowerCase(),
        )
      : null;

    if (matchedCity) {
      setSelectedCityName(matchedCity.name);
    }
  }, [initialData?.location, countries]);

  useEffect(() => {
    if (!selectedCountryCode) return;

    const countryName =
      countries.find((country) => country.isoCode === selectedCountryCode)
        ?.name || "";
    const stateName =
      states.find((state) => state.isoCode === selectedStateCode)?.name || "";

    const parts = [];
    if (selectedCityName) parts.push(selectedCityName);
    if (stateName) parts.push(stateName);
    if (countryName) parts.push(countryName);

    const nextLocation = parts.join(", ");

    setFormData((prevData) =>
      prevData.location === nextLocation
        ? prevData
        : { ...prevData, location: nextLocation },
    );
  }, [
    selectedCityName,
    selectedStateCode,
    selectedCountryCode,
    states,
    countries,
  ]);

  const handleCountryChange = (e) => {
    const nextCountryCode = e.target.value;
    setSelectedCountryCode(nextCountryCode);
    setSelectedStateCode("");
    setSelectedCityName("");
  };

  const handleStateChange = (e) => {
    const nextStateCode = e.target.value;
    setSelectedStateCode(nextStateCode);
    setSelectedCityName("");
  };

  const handleCityChange = (e) => {
    setSelectedCityName(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...formData[field]];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    const newItem = field === "education"
      ? { school: "", degree: "", from: "", to: "" }
      : { company: "", role: "", from: "", to: "" };
    setFormData({ ...formData, [field]: [...formData[field], newItem] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPicture(true);
    setError("");
    try {
      const response = await api.uploadProfilePicture(file);
      if (response.success) {
        setFormData({ ...formData, profilePicture: response.profilePicture });
        setPicturePreview(response.profilePicture);
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
        setFormData({ ...formData, resume: response.resume });
      }
    } catch (err) {
      setError(err.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeDownload = async () => {
    if (!formData.resume) return;
    try {
      const response = await fetch(formData.resume);
      if (!response.ok) throw new Error("Failed to download resume");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const parts = formData.resume.split("/");
      link.download = parts[parts.length - 1] || "resume";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err.message || "Failed to download resume");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Date Validation
    const validateDates = (arr) => {
      for (const item of arr) {
        if (!item.from) return "Please select 'From' date";
        if (item.to !== "Present" && !item.to) return "Please select 'To' date";
        
        const fromDate = new Date(item.from);
        const today = new Date();
        
        if (fromDate > today) return "Start date cannot be in the future";
        
        if (item.to !== "Present") {
          const toDate = new Date(item.to);
          if (toDate > today) return "End date cannot be in the future";
          if (fromDate > toDate) return "Start date must come before End date";
        }
      }
      return null;
    };

    const eduError = validateDates(formData.education);
    if (eduError) { setError(`Education: ${eduError}`); return; }

    const expError = validateDates(formData.experience);
    if (expError) { setError(`Experience: ${expError}`); return; }

    if (Number(formData.yearsOfExperience) > 0 && formData.experience.length === 0) {
      setError("Please add at least one Experience entry, or set your Total Experience to 0.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        yearsOfExperience: Number(formData.yearsOfExperience) || 0,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const response = await api.updateProfile(payload);
      if (response.success) {
        onSave(response);
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-gray-600">
          Fields marked with <span className="text-red-500">*</span> are
          required.
        </p>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={selectedCountryCode}
              onChange={handleCountryChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStateCode}
              onChange={handleStateChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!selectedCountryCode || states.length === 0}
              required
            >
              <option value="">
                {selectedCountryCode
                  ? states.length > 0
                    ? "Select State"
                    : "No States Available"
                  : "Select Country First"}
              </option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCityName}
              onChange={handleCityChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!selectedCountryCode || cities.length === 0}
              required
            >
              <option value="">
                {selectedCountryCode
                  ? cities.length > 0
                    ? "Select City"
                    : "No Cities Available"
                  : "Select Country First"}
              </option>
              {cities.map((city, index) => (
                <option
                  key={`${city.name}-${city.stateCode || ""}-${index}`}
                  value={city.name}
                >
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {formData.location || "-"}
          </p>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Profile Picture <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4 items-start">
            {picturePreview && (
              <div className="relative">
                <img
                  src={picturePreview}
                  alt="Preview"
                   className="h-32 w-32 rounded-xl object-cover border-2 border-blue-200 shadow-md"
                />
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  ✓ Current
                </span>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                id="editFormProfilePicture"
                accept="image/*"
                onChange={handlePictureUpload}
                disabled={uploadingPicture}
                className="hidden"
              />
              <label
                htmlFor="editFormProfilePicture"
                className="block w-full px-6 py-4 border-2 border-dashed border-blue-300 rounded-xl text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <svg
                  className="w-8 h-8 text-blue-600 mx-auto mb-2"
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
                  Click to upload picture
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </label>
              {uploadingPicture && (
                <div className="mt-3 flex items-center gap-2 text-blue-600">
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
                  <p className="text-sm">Uploading picture...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resume */}
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
                      Ready to share with others
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
                  <button
                    type="button"
                    onClick={handleResumeDownload}
                    className="px-3 py-1.5 bg-gray-600 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ⬇️ Download
                  </button>
                </div>
              </div>
            </div>
          )}
          <input
            type="file"
            id="editFormResumeFile"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleResumeUpload}
            disabled={uploadingResume}
            className="hidden"
          />
          <label
            htmlFor="editFormResumeFile"
            className="block w-full px-6 py-4 border-2 border-dashed border-blue-300 rounded-xl text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <svg
              className="w-8 h-8 text-blue-600 mx-auto mb-2"
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
            <div className="mt-3 flex items-center gap-2 text-blue-600">
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

        {/* Availability */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Availability <span className="text-red-500">*</span>
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="not available">Not Available</option>
            <option value="part-time">Part-time</option>
            <option value="full-time">Full-time</option>
          </select>
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Education <span className="text-red-500">*</span>
          </label>
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg relative bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => removeArrayItem("education", index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                  title="Remove"
                >
                  ✕
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleArrayChange("education", index, "school", e.target.value)}
                    placeholder="School / College"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)}
                    placeholder="Degree / Standard"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      type="month"
                      max={new Date().toISOString().slice(0, 7)}
                      value={edu.from || ""}
                      onChange={(e) => handleArrayChange("education", index, "from", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <input
                      type="month"
                      max={new Date().toISOString().slice(0, 7)}
                      value={edu.to || ""}
                      onChange={(e) => handleArrayChange("education", index, "to", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("education")}
              className="text-sm font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-2 flex items-center gap-2"
            >
               <span>+</span> Add Education
            </button>
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Experience {Number(formData.yearsOfExperience) > 0 && <span className="text-red-500">*</span>}
          </label>
          <div className="space-y-4">
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg relative bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => removeArrayItem("experience", index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                  title="Remove"
                >
                  ✕
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)}
                    placeholder="Company Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => handleArrayChange("experience", index, "role", e.target.value)}
                    placeholder="Role"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      type="month"
                      max={new Date().toISOString().slice(0, 7)}
                      value={exp.from || ""}
                      onChange={(e) => handleArrayChange("experience", index, "from", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs text-gray-500">To</label>
                      <label className="flex items-center gap-1 text-xs text-blue-600 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.to === "Present"}
                          onChange={(e) => handleArrayChange("experience", index, "to", e.target.checked ? "Present" : "")}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        Present
                      </label>
                    </div>
                    <input
                      type="month"
                      max={new Date().toISOString().slice(0, 7)}
                      value={exp.to === "Present" ? "" : exp.to || ""}
                      onChange={(e) => handleArrayChange("experience", index, "to", e.target.value)}
                      disabled={exp.to === "Present"}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("experience")}
              className="text-sm font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-2 flex items-center gap-2"
            >
               <span>+</span> Add Experience
            </button>
          </div>
        </div>

        {/* Role and Company (Current Overview) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Current Role
            </label>
            <input
              type="text"
              name="currentRole"
              value={formData.currentRole}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Skillify Inc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Years of Experience
          </label>
          <input
            type="number"
            min="0"
            max="60"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            placeholder="e.g. 2"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Skills (comma separated) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB, UI/UX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              GitHub URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              LinkedIn URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Portfolio URL
          </label>
          <input
            type="url"
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Profile Visibility */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Profile Visibility
          </label>
          <select
            name="profileVisibility"
            value={formData.profileVisibility}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="public">Public (visible to all users)</option>
            <option value="private">Private (only visible to you)</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}
