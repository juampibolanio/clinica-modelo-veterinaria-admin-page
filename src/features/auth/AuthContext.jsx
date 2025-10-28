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

    // 🔹 Guarda token JWT
    const accessToken = data.token || data.jwt || data.accessToken;
    if (!accessToken) throw new Error("No se recibió token JWT");

    setToken(accessToken);
    localStorage.setItem("cmv_token", accessToken);

    // 🔹 Guarda los datos del usuario (según el JSON del backend)
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

    return userData;
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

export const useAuth = () => useContext(AuthContext);
