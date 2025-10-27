import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { bindAuth } from "../../libs/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("cmv_token") || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("cmv_user");
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthenticated = !!token;

  const login = async (payload) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`;

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

    const accessToken = data.token || data.accessToken || data.jwt || data?.data?.token;
    if (!accessToken) throw new Error("No se recibió el token JWT");

    setToken(accessToken);
    localStorage.setItem("cmv_token", accessToken);

    const u = data.user || data.profile || null;
    if (u) {
      setUser(u);
      localStorage.setItem("cmv_user", JSON.stringify(u));
    }

    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("cmv_token");
    localStorage.removeItem("cmv_user");
    sessionStorage.clear();
    window.history.replaceState(null, "", "/login");
  };

  useEffect(() => {
    bindAuth({ token, logout });
  }, [token]);

  const value = useMemo(
    () => ({ token, user, isAuthenticated, login, logout, setUser }),
    [token, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
