const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

const request = async (path, options = {}) => {
  const { method = "GET", body, token } = options;
  const headers = {
    "Content-Type": "application/json",
  };

  const authToken = token || getToken();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }

  return data;
};

const fileRequest = async (path, file) => {
  const formData = new FormData();
  formData.append(path.includes("picture") ? "profilePicture" : "resume", file);

  const headers = {};
  const authToken = getToken();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || "Upload failed";
    throw new Error(message);
  }

  return data;
};

const multipartRequest = async (
  path,
  payload = {},
  file = null,
  fileFieldName = "file",
) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  if (file) {
    formData.append(fileFieldName, file);
  }

  const headers = {};
  const authToken = getToken();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }

  return data;
};

export const api = {
  signup: (payload) =>
    request("/api/auth/signup", { method: "POST", body: payload }),
  login: (payload) =>
    request("/api/auth/login", { method: "POST", body: payload }),
  verifyEmail: (token) =>
    request("/api/auth/verify-email", {
      method: "POST",
      body: { token },
    }),
  resendVerification: (email) =>
    request("/api/auth/resend-verification", {
      method: "POST",
      body: { email },
    }),
  forgotPassword: (email) =>
    request("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),
  resetPassword: (payload) =>
    request("/api/auth/reset-password", {
      method: "POST",
      body: payload,
    }),
  getMe: () => request("/api/auth/me"),
  updateProfile: (payload) =>
    request("/api/profile/update", { method: "PUT", body: payload }),
  getMyProfile: () => request("/api/profile/me"),
  getProfileStatus: () => request("/api/profile/status"),
  getUserProfile: (userId) => request(`/api/profile/${userId}`),
  updateProfileVisibility: (profileVisibility) =>
    request("/api/profile/visibility", {
      method: "PUT",
      body: { profileVisibility },
    }),
  discoverProfiles: (params) =>
    request(`/api/profile/discover${buildQuery(params)}`),
  uploadProfilePicture: (file) =>
    fileRequest("/api/profile/upload-picture", file),
  uploadResume: (file) => fileRequest("/api/profile/upload-resume", file),
  requestAccountDeletion: () =>
    request("/api/profile/request-delete", { method: "POST" }),
  deleteAccount: (token) =>
    request("/api/profile/delete", { method: "DELETE", body: { token } }),
  publishJob: (payload, file) =>
    multipartRequest(
      "/api/jobs/publish",
      payload,
      file,
      "jobDescriptionDocument",
    ),
  discoverJobs: (params) => request(`/api/jobs/discover${buildQuery(params)}`),
  applyToJob: (jobId) =>
    request(`/api/jobs/${jobId}/apply`, {
      method: "POST",
    }),
  getSentApplications: () => request("/api/jobs/applications/sent"),
  getReceivedApplications: () => request("/api/jobs/applications/received"),
  getReceivedApplicationsForJob: (jobId) =>
    request(`/api/jobs/applications/received?jobId=${jobId}`),
  getMyPostedJobs: () => request("/api/jobs/my-posts"),
  updateApplicationStatus: (applicationId, status) =>
    request(`/api/jobs/applications/${applicationId}/status`, {
      method: "PUT",
      body: { status },
    }),
  toggleJobStatus: (jobId, closingDate) =>
    request(`/api/jobs/${jobId}/status`, {
      method: "PUT",
      body: closingDate ? { closingDate } : {},
    }),
};
