import axios from "axios";
import { buildMockAnalysis } from "../utils/mockData";

// =====================================================
// API BASE
// =====================================================

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

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
    }

    return Promise.reject(error);
  },
);

// =====================================================
// AUTH APIs
// =====================================================

export async function loginRequest(email, password) {
  try {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    return data;
  } catch (err) {
    if (err.code === "ERR_NETWORK") {
      return mockAuthResponse(email.split("@")[0], email);
    }

    throw new Error(
      err.response?.data?.message || "Invalid email or password.",
    );
  }
}

export async function registerRequest(name, email, password) {
  try {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    return data;
  } catch (err) {
    if (err.code === "ERR_NETWORK") {
      return mockAuthResponse(name, email);
    }

    throw new Error(
      err.response?.data?.message || "Could not create your account.",
    );
  }
}

function mockAuthResponse(name, email) {
  return {
    token: "demo-token",
    user: {
      id: "demo",
      name,
      email,
    },
  };
}

// =====================================================
// ANALYSIS API
// =====================================================

export async function analyzeCodeRequest(payload) {
  try {
    const { data } = await api.post("/analyze", payload);
    return data;
  } catch (err) {
    if (err.code === "ERR_NETWORK") {
      return mockAnalysis(payload);
    }

    throw new Error(err.response?.data?.message || "Analysis failed.");
  }
}

// =====================================================
// HISTORY APIs
// =====================================================

export async function getHistoryRequest() {
  const { data } = await api.get("/reviews");
  return data;
}

export async function getReviewRequest(id) {
  const { data } = await api.get(`/reviews/${id}`);
  return data;
}

// =====================================================
// DASHBOARD APIs
// =====================================================

export async function getDashboardStatsRequest() {
  const { data } = await api.get("/dashboard/stats");
  return data;
}

// =====================================================
// PROFILE APIs
// =====================================================

export async function getProfileRequest() {
  const { data } = await api.get("/user/profile");
  return data;
}

export async function updateProfileRequest(payload) {
  const { data } = await api.put("/user/profile", payload);
  return data;
}

export async function changePasswordRequest(payload) {
  const { data } = await api.patch("/user/password", payload);
  return data;
}

export async function deleteAccountRequest() {
  const { data } = await api.delete("/user/account");
  return data;
}
export async function getProgressRequest() {
  const { data } = await api.get("/progress");
  return data;
}
export async function renameReviewRequest(id, title) {
  const { data } = await api.patch(`/reviews/${id}/title`, {
    title,
  });

  return data;
}

export async function deleteReviewRequest(id) {
  const { data } = await api.delete(`/reviews/${id}`);

  return data;
}
export async function forgotPasswordRequest(email) {
  const { data } = await api.post("/auth/forgot-password", {
    email,
  });
  return data;
}

export async function verifyOtpRequest(email, otp) {
  const { data } = await api.post("/auth/verify-otp", {
    email,
    otp,
  });
  return data;
}

export async function resetPasswordRequest(email, otp, newPassword) {
  const { data } = await api.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  return data;
}
export async function resendOtpRequest(email) {
  const { data } = await api.post("/auth/forgot-password", {
    email,
  });

  return data;
}
// =====================================================
// MOCKS
// =====================================================

function mockAnalysis(payload) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(buildMockAnalysis(payload)), 1400);
  });
}
