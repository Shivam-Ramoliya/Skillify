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
  getConnectionsData: () => request("/api/profile/connections"),
  sendConnectionRequest: (targetUserId) =>
    request(`/api/profile/connections/send/${targetUserId}`, {
      method: "POST",
    }),
  withdrawConnectionRequest: (targetUserId) =>
    request(`/api/profile/connections/withdraw/${targetUserId}`, {
      method: "POST",
    }),
  acceptConnectionRequest: (senderUserId) =>
    request(`/api/profile/connections/accept/${senderUserId}`, {
      method: "POST",
    }),
  declineConnectionRequest: (senderUserId) =>
    request(`/api/profile/connections/decline/${senderUserId}`, {
      method: "POST",
    }),
  requestDisconnectConnection: (targetUserId, rating) =>
    request(`/api/profile/connections/disconnect-request/${targetUserId}`, {
      method: "POST",
      body: { rating },
    }),
  confirmDisconnectConnection: (requesterUserId, rating) =>
    request(`/api/profile/connections/disconnect-confirm/${requesterUserId}`, {
      method: "POST",
      body: { rating },
    }),
};
