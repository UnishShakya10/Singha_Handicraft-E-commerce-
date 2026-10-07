import axios from "axios";

const configuredApiUrl = new URL(
  import.meta.env.VITE_API_URL || "http://localhost:8080"
);
const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

if (
  import.meta.env.DEV &&
  typeof window !== "undefined" &&
  loopbackHosts.has(configuredApiUrl.hostname.toLowerCase()) &&
  !loopbackHosts.has(window.location.hostname.toLowerCase())
) {
  configuredApiUrl.hostname = window.location.hostname;
}

export const API_BASE = configuredApiUrl.toString().replace(/\/+$/, "");

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

  if (normalizedPath.startsWith("data:")) {
    return normalizedPath;
  }

  if (/^https?:\/\//i.test(normalizedPath)) {
    const imageUrl = new URL(normalizedPath);
    if (
      loopbackHosts.has(imageUrl.hostname.toLowerCase()) &&
      !loopbackHosts.has(new URL(API_BASE).hostname.toLowerCase())
    ) {
      const apiUrl = new URL(API_BASE);
      imageUrl.protocol = apiUrl.protocol;
      imageUrl.host = apiUrl.host;
      return imageUrl.toString();
    }
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