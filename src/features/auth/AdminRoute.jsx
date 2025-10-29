import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

/**
 * Ruta exclusiva para administradores.
 * Si el usuario no está logueado o no es ADMIN, lo redirige al inicio.
 */
const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
