import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthContext";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "../features/auth/AdminRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import Login from "../pages/Login";
import DashboardHome from "../pages/DashboardHome";

// Turnos
import Appointments from "../features/appointments/pages/Appointments";
import AppointmentCreate from "../features/appointments/pages/AppointmentCreate";
import AppointmentDetail from "../features/appointments/pages/AppointmentDetail";
import AppointmentEdit from "../features/appointments/pages/AppointmentEdit";

// Reportes y estadísticas
import Reports from "../features/reports/pages/Reports";

// Blog
import BlogList from "../features/blog/pages/BlogList";
import BlogCreate from "../features/blog/pages/BlogCreate";
import BlogEdit from "../features/blog/pages/BlogEdit";

// Dueños (Owners)
import OwnersList from "../features/owners/pages/OwnerList";
import OwnerCreate from "../features/owners/pages/OwnerCreate";
import OwnerEdit from "../features/owners/pages/OwnerEdit";
import OwnerDetail from "../features/owners/pages/OwnerDetail";

// Mascotas (Pets)
import Pets from "../features/pets/pages/PetsList";
import PetCreate from "../features/pets/pages/PetCreate";
import PetDetail from "../features/pets/pages/PetDetail";
import PetEdit from "../features/pets/pages/PetEdit";

// Productos → Categorías
import CategoryList from "../features/products/categories/pages/CategoryList";
import CategoryCreate from "../features/products/categories/pages/CategoryCreate";
import CategoryEdit from "../features/products/categories/pages/CategoryEdit";

// Productos
import ProductList from "../features/products/pages/ProductList";
import ProductCreate from "../features/products/pages/ProductCreate";
import ProductEdit from "../features/products/pages/ProductEdit";

// Historias Clínicas
import ClinicalHistoryList from "../features/clinical-history/pages/ClinicalHistoryList";
import ClinicalHistoryCreate from "../features/clinical-history/pages/ClinicalHistoryCreate";
import ClinicalHistoryDetail from "../features/clinical-history/pages/ClinicalHistoryDetail";
import ClinicalHistoryEdit from "../features/clinical-history/pages/ClinicalHistoryEdit";

// Seguridad (Usuarios del sistema)
import UsersList from "../features/users/pages/UserList";
import UserCreate from "../features/users/pages/UserCreate";
import UserEdit from "../features/users/pages/UserEdit";

// Vacunas Aplicadas
import AppliedVaccineList from "../features/applied-vaccines/pages/AppliedVaccineList";
import AppliedVaccineCreate from "../features/applied-vaccines/pages/AppliedVaccineCreate";
import AppliedVaccineDetail from "../features/applied-vaccines/pages/AppliedVaccineDetail";
import AppliedVaccineEdit from "../features/applied-vaccines/pages/AppliedVaccineEdit";

const Router = () => (
  <AuthProvider>
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          {/* --- DUEÑOS --- */}
          <Route path="owners" element={<OwnersList />} />
          <Route path="owners/create" element={<OwnerCreate />} />
          <Route path="owners/:id/edit" element={<OwnerEdit />} />
          <Route path="owners/:id" element={<OwnerDetail />} />

          {/* --- MASCOTAS --- */}
          <Route path="pets" element={<Pets />} />
          <Route path="pets/create" element={<PetCreate />} />
          <Route path="pets/:id" element={<PetDetail />} />
          <Route path="pets/:id/edit" element={<PetEdit />} />

          {/* --- TURNOS --- */}
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/create" element={<AppointmentCreate />} />
          <Route path="appointments/:id" element={<AppointmentDetail />} />
          <Route path="appointments/:id/edit" element={<AppointmentEdit />} />

          {/* --- REPORTES Y ESTADÍSTICAS --- */}
          <Route path="reports" element={<Reports />} />

          {/* --- BLOG --- */}
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogCreate />} />
          <Route path="blog/:id/edit" element={<BlogEdit />} />

          {/* --- PRODUCTOS --- */}
          <Route path="products/categories" element={<CategoryList />} />
          <Route path="products/categories/create" element={<CategoryCreate />} />
          <Route path="products/categories/edit/:id" element={<CategoryEdit />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />

          {/* --- HISTORIAS CLÍNICAS --- */}
          <Route path="clinical-history" element={<ClinicalHistoryList />} />
          <Route path="clinical-history/create" element={<ClinicalHistoryCreate />} />
          <Route path="clinical-history/:id" element={<ClinicalHistoryDetail />} />
          <Route path="clinical-history/:id/edit" element={<ClinicalHistoryEdit />} />

          {/* --- VACUNACIÓN --- */}
          <Route path="applied-vaccines" element={<AppliedVaccineList />} />
          <Route path="applied-vaccines/create" element={<AppliedVaccineCreate />} />
          <Route path="applied-vaccines/:id" element={<AppliedVaccineDetail />} />
          <Route path="applied-vaccines/:id/edit" element={<AppliedVaccineEdit />} />

          {/* --- SEGURIDAD (solo ADMIN) --- */}
          <Route
            path="security"
            element={
              <AdminRoute>
                <UsersList />
              </AdminRoute>
            }
          />
          <Route
            path="security/create"
            element={
              <AdminRoute>
                <UserCreate />
              </AdminRoute>
            }
          />
          <Route
            path="security/:id/edit"
            element={
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
            }
          />
        </Route>
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
);

export default Router;
