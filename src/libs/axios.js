import axios from "axios";

/**
 * This archive creates an axios instance with interceptors for handling authentication tokens
 * and automatic logout on 401 responses.
 */

// Auth reference to hold token and logout function
let authRef = { token: null, logout: () => {} };

// Function to bind auth getters
export const bindAuth = (getters) => {
  authRef = getters;
};

// Axios instance 
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

// Request interceptor for adding auth token
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

// Response interceptor for handling 401 errors
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
