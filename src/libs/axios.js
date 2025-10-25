import axios from 'axios';

// NOTA: el interceptor necesita acceder a logout. Para evitar import circular,
// exponemos un setter que el AuthContext llamará al montar.
let authRef = { token: null, logout: () => {} };
export const bindAuth = (getters) => { authRef = getters; };

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (authRef.token) {
      config.headers.Authorization = `Bearer ${authRef.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Token inválido/expirado → cerramos sesión y redirigimos a login
      try { authRef.logout(); } catch { /* empty */ }
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
