import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000, // 10s timeout
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!navigator.onLine) {
      console.warn("You are offline. API request failed:", error);
    } else {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        // Token expired or unauthorized
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      console.error("API error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
