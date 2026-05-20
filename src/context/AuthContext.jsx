import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiClient, setAuthToken } from "../api/client.js";
import * as authApi from "../api/auth.js";

const STORAGE_KEY = "et_admin_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem(STORAGE_KEY));

  const setToken = useCallback((next) => {
    if (next) {
      localStorage.setItem(STORAGE_KEY, next);
      setAuthToken(next);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
    }
    setTokenState(next);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await authApi.fetchProfile();
    setUser(profile);
    return profile;
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { token: jwt, user: loggedIn } = await authApi.login(email, password);
      if (loggedIn.role !== "super_admin") {
        throw new Error("Organization staff sign in on the User app. Super admin only here.");
      }
      setToken(jwt);
      setUser(loggedIn);
      return loggedIn;
    },
    [setToken],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    refreshProfile()
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token, refreshProfile, setToken]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,
      refreshProfile,
      isAuthenticated: !!token && !!user,
    }),
    [token, user, loading, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getAdminStoredToken() {
  return localStorage.getItem(STORAGE_KEY);
}
