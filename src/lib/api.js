import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const fileUrl = (path) => {
  if (!path) return "";

  const normalizedPath = String(path)
    .trim()
    .replace(/^['"]|['"]$/g, "");

  if (
    /^https?:\/\//i.test(normalizedPath) ||
    normalizedPath.startsWith("data:")
  ) {
    return normalizedPath;
  }

  return `${API_BASE}${
    normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`
  }`;
};

export const formatPrice = (amount) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(Number(amount));