import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthContext";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import Login from "../pages/Login";
import DashboardHome from "../pages/DashboardHome";

// Módulos principales
import Appointments from "../pages/Appointments";
import Stock from "../pages/Stock";
import Reports from "../pages/Reports";
import Security from "../pages/Security";

// Blog
import BlogList from "../features/blog/pages/BlogList";
import BlogCreate from "../features/blog/pages/BlogCreate";
import BlogEdit from "../features/blog/pages/BlogEdit";

// 🧠 Owners (nuevo módulo completo)
import OwnersList from "../features/owners/pages/OwnerList";
import OwnerCreate from "../features/owners/pages/OwnerCreate";
import OwnerEdit from "../features/owners/pages/OwnerEdit";
import OwnerDetail from "../features/owners/pages/OwnerDetail";

// Pets módulo detallado
import Pets from "../features/pets/pages/PetsList";
import PetCreate from "../features/pets/pages/PetCreate";
import PetDetail from "../features/pets/pages/PetDetail";
import PetEdit from "../features/pets/pages/PetEdit";

const Router = () => (
  <AuthProvider>
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          {/* 🧩 Clientes / Dueños */}
          <Route path="owners" element={<OwnersList />} />
          <Route path="owners/create" element={<OwnerCreate />} />
          <Route path="owners/:id/edit" element={<OwnerEdit />} />
          <Route path="owners/:id" element={<OwnerDetail />} />

          {/* Otros módulos */}
          <Route path="appointments" element={<Appointments />} />
          <Route path="stock" element={<Stock />} />
          <Route path="reports" element={<Reports />} />
          <Route path="security" element={<Security />} />

          {/* Blog */}
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogCreate />} />
          <Route path="blog/:id/edit" element={<BlogEdit />} />

          {/* Pets */}
          <Route path="pets" element={<Pets />} />
          <Route path="pets/create" element={<PetCreate />} />
          <Route path="pets/:id" element={<PetDetail />} />
          <Route path="pets/:id/edit" element={<PetEdit />} />

        </Route>
      </Route>

      {/* Any other route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
);

export default Router;
