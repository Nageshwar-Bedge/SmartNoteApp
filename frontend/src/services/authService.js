import api from "./api";

// User registration
export const registerUser = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    return res.data;
  } catch (err) {
    const error = err.response?.data?.message || err.message || "Registration failed";
    throw new Error(error);
  }
};

// User login
export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (err) {
    const error = err.response?.data?.message || err.message || "Login failed";
    throw new Error(error);
  }
};

// Get logged-in user details
export const getCurrentUser = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    const error = err.response?.data?.message || err.message || "Unable to fetch user";
    throw new Error(error);
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
