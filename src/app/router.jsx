import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthContext";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import Login from "../pages/Login";
import DashboardHome from "../pages/DashboardHome";
import Owners from "../pages/Owners";
import Pets from "../pages/Pets";
import Appointments from "../pages/Appointments";
import Stock from "../pages/Stock";
import Reports from "../pages/Reports";
import Security from "../pages/Security";
import BlogList from "../features/blog/pages/BlogList";
import BlogCreate from "../features/blog/pages/BlogCreate";
import BlogEdit from "../features/blog/pages/BlogEdit";

const Router = () => (
  <AuthProvider>
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="owners" element={<Owners />} />
          <Route path="pets" element={<Pets />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="stock" element={<Stock />} />
          <Route path="reports" element={<Reports />} />
          <Route path="security" element={<Security />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogCreate />} />
          <Route path="blog/:id/edit" element={<BlogEdit />} />
        </Route>
      </Route>

      {/* Cualquier otra ruta */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
);

export default Router;
