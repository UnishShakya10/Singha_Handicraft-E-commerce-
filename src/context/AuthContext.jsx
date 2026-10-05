/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { fileUrl } from "../lib/api";

const AuthContext = createContext(null);

const readClaims = (token) => {
  if (!token) return null;
  try {
    const encodedPayload = token.split(".")[1];
    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
    if (payload.exp && payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

const readUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw || raw === "undefined" || raw === "null") return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => readUser());
  const claims = readClaims(token);
  const role = String(claims?.role || "").toLowerCase();
  const authenticatedUser = useMemo(
    () => (user && role ? { ...user, role } : user),
    [user, role]
  );

  const login = useCallback((nextToken, nextUser) => {
    const nextClaims = readClaims(nextToken);
    const nextRole = String(nextClaims?.role || "").toLowerCase();
    if (!nextClaims || !nextRole || !nextUser) {
      throw new Error("The server returned an invalid authentication token.");
    }
    const userWithRole = {
      ...nextUser,
      id: nextUser.id || nextClaims.id,
      role: nextRole,
    };
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(userWithRole));
    setToken(nextToken);
    setUser(userWithRole);
    return userWithRole;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const avatarSrc = authenticatedUser?.avatar ? fileUrl(authenticatedUser.avatar) : "";

  const value = useMemo(
    () => ({
      token,
      user: authenticatedUser,
      role,
      isLoggedIn: Boolean(token && claims && authenticatedUser && role),
      avatarSrc,
      login,
      logout,
    }),
    [token, authenticatedUser, role, claims, avatarSrc, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
