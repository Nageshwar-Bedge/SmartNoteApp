import api from "../api";

// User registration
export const registerUser = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration failed" };
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
    throw err.response?.data || { message: "Login failed" };
  }
};

// Get logged-in user details
export const getCurrentUser = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Unable to fetch user" };
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
};
