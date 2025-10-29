import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to access authentication context.
 * @returns {object} Auth context value (user, token, login, logout, etc.)
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
