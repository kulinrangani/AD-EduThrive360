import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "https://em360-be.onrender.com";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function getApiBaseUrl() {
  return baseURL;
}

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export function getStoredToken() {
  return localStorage.getItem("et_admin_token");
}
