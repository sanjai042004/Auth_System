import { api } from "./api";

// Register new user
export const registerUser = async (formData) => {
  const res = await api.post("/auth/register", formData, { withCredentials: true });
  return res.data;
};

// Login user
export const loginUser = async (formData) => {
  const res = await api.post("/auth/login", formData, { withCredentials: true });
  return res.data;
};

//google login user

export const googleLogin = async (token) => {
  const res = await api.post(
    "/auth/google-login", { token }, { withCredentials: true }
  );
  return res.data
}

// Logout user
export const logoutUser = async () => {
  const res = await api.post("/auth/logout", {}, { withCredentials: true });
  return res.data;
};

// Refresh token
export const refreshToken = async () => {
  const res = await api.get("/auth/refresh", { withCredentials: true });
  return res.data;
};
