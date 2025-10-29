import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { bindAuth } from "../../libs/axios";
import { isTokenExpired } from "./utils/jwt.utils";
import { AuthContext } from "./context/AuthContext";
import SessionExpiredDialog from "./components/SessionExpiredDialog";

/**
 * Authentication Provider
 * Handles login, logout, token persistence, axios binding, and session expiration.
 */
export const AuthProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [token, setToken] = useState(() => localStorage.getItem("cmv_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("cmv_user");
    return raw ? JSON.parse(raw) : null;
  });

  const [sessionExpired, setSessionExpired] = useState(false);
  const isAuthenticated = !!token;

  /**
   * Login user and persist token + user data
   */
  const login = useCallback(
    async (payload) => {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`;

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || "Credenciales inválidas");
        }

        const data = await res.json();
        const accessToken = data.token || data.jwt || data.accessToken;
        if (!accessToken) throw new Error("No se recibió token JWT");

        setToken(accessToken);
        localStorage.setItem("cmv_token", accessToken);

        const userData = {
          id: data.id,
          username: data.username,
          name: data.name,
          surname: data.surname,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
        };

        setUser(userData);
        localStorage.setItem("cmv_user", JSON.stringify(userData));

        enqueueSnackbar("Inicio de sesión exitoso 👋", { variant: "success" });
        return userData;
      } catch (error) {
        console.error("Error en login:", error);
        throw error;
      }
    },
    [enqueueSnackbar]
  );

  /**
   * Logout user, clear local storage and redirect
   */
  const logout = useCallback(
    (showMessage = true) => {
      setToken(null);
      setUser(null);
      localStorage.removeItem("cmv_token");
      localStorage.removeItem("cmv_user");
      sessionStorage.clear();

      if (showMessage) {
        enqueueSnackbar("Sesión finalizada", { variant: "info" });
      }

      window.location.replace("/login");
    },
    [enqueueSnackbar]
  );

  /**
   * Attach token to axios globally
   */
  useEffect(() => {
    bindAuth({ token, logout });
  }, [token, logout]);

  /**
   * Watch for token expiration (auto logout)
   */
  useEffect(() => {
    if (!token) return;

    // Immediate check
    if (isTokenExpired(token)) {
      setSessionExpired(true);
      return;
    }

    // Re-check every minute
    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        setSessionExpired(true);
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  /**
   * Handle confirm action when session expired dialog is accepted
   */
  const handleSessionExpiredConfirm = useCallback(() => {
    setSessionExpired(false);
    logout(false);
  }, [logout]);

  /**
   * Memoized context value for global access
   */
  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      logout,
      setUser,
    }),
    [token, user, isAuthenticated, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Global modal for session expiration */}
      <SessionExpiredDialog
        open={sessionExpired}
        onConfirm={handleSessionExpiredConfirm}
      />
    </AuthContext.Provider>
  );
};
