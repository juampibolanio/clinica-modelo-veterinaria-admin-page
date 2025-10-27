import axios from "axios";

let authRef = { token: null, logout: () => {} };

export const bindAuth = (getters) => {
  authRef = getters;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (authRef.token) {
      config.headers.Authorization = `Bearer ${authRef.token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        authRef.logout();
      } catch { /* no content */}
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
