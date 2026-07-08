import axios from "axios";

// =====================================================
// API BASE
// =====================================================

export const API_BASE = "https://logiclense-production.up.railway.app";

export const api = axios.create({
  baseURL: API_BASE,
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("logiclens_token") ||
    sessionStorage.getItem("logiclens_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("logiclens_token");
      localStorage.removeItem("logiclens_user");
      sessionStorage.removeItem("logiclens_token");
      sessionStorage.removeItem("logiclens_user");
    }

    return Promise.reject(error);
  }
);

// =====================================================
// AUTH APIs
// =====================================================

export async function loginRequest(email, password) {
  try {
    const { data } = await api.post("/api/auth/login", {
      email,
      password,
    });

    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Invalid email or password."
    );
  }
}

export async function registerRequest(name, email, password) {
  try {
    const { data } = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });

    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Could not create your account."
    );
  }
}

// =====================================================
// ANALYSIS API
// =====================================================

export async function analyzeCodeRequest(payload) {
  try {
    const { data } = await api.post("/api/analyze", payload);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Analysis failed.");
  }
}

// =====================================================
// HISTORY APIs
// =====================================================

export async function getHistoryRequest() {
  const { data } = await api.get("/api/reviews");
  return data;
}

export async function getReviewRequest(id) {
  const { data } = await api.get(`/api/reviews/${id}`);
  return data;
}

// =====================================================
// DASHBOARD APIs
// =====================================================

export async function getDashboardStatsRequest() {
  const { data } = await api.get("/api/dashboard/stats");
  return data;
}

// =====================================================
// PROFILE APIs
// =====================================================

export async function getProfileRequest() {
  const { data } = await api.get("/api/user/profile");
  return data;
}

export async function updateProfileRequest(payload) {
  const { data } = await api.put("/api/user/profile", payload);
  return data;
}

export async function changePasswordRequest(payload) {
  const { data } = await api.patch("/api/user/password", payload);
  return data;
}

export async function deleteAccountRequest() {
  const { data } = await api.delete("/api/user/account");
  return data;
}

// =====================================================
// PROGRESS
// =====================================================

export async function getProgressRequest() {
  const { data } = await api.get("/api/progress");
  return data;
}

// =====================================================
// REVIEW MANAGEMENT
// =====================================================

export async function renameReviewRequest(id, title) {
  const { data } = await api.patch(`/api/reviews/${id}/title`, {
    title,
  });

  return data;
}

export async function deleteReviewRequest(id) {
  const { data } = await api.delete(`/api/reviews/${id}`);
  return data;
}

// =====================================================
// PASSWORD RESET
// =====================================================

export async function forgotPasswordRequest(email) {
  try {
    const { data } = await api.post("/api/auth/forgot-password", {
      email,
    });

    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
        "Could not send OTP. Please try again."
    );
  }
}

export async function verifyOtpRequest(email, otp) {
  try {
    const { data } = await api.post("/api/auth/verify-otp", {
      email,
      otp,
    });

    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Could not verify OTP."
    );
  }
}

export async function resetPasswordRequest(email, otp, newPassword) {
  try {
    const { data } = await api.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });

    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Could not reset password."
    );
  }
}

export async function resendOtpRequest(email) {
  try {
    const { data } = await api.post("/api/auth/forgot-password", {
      email,
    });

    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Could not resend OTP."
    );
  }
}