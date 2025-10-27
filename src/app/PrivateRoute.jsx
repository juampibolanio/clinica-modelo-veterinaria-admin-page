import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../features/auth/AuthContext";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      window.history.replaceState(null, "", "/login");
    }
  }, [isAuthenticated]);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
