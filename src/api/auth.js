import { apiClient } from "./client.js";

export async function login(email, password) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
}

export async function getProfile() {
  const { data } = await apiClient.get("/auth/profile");
  return data.user;
}

export const fetchProfile = getProfile;

export async function forgotPassword(email) {
  const { data } = await apiClient.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token, password) {
  const { data } = await apiClient.post("/auth/reset-password", { token, password });
  return data;
}

export async function updateProfile(payload) {
  const { data } = await apiClient.put("/auth/profile", payload);
  return data.user;
}
