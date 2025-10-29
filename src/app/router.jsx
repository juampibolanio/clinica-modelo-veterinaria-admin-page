import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthProvider";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "../features/auth/AdminRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

// Login and dashboard
import Login from "../features/auth/Login";
import DashboardHome from "../features/dashboard/DashboardHome";

// Appointments 
import Appointments from "../features/appointments/pages/Appointments";
import AppointmentCreate from "../features/appointments/pages/AppointmentCreate";
import AppointmentDetail from "../features/appointments/pages/AppointmentDetail";
import AppointmentEdit from "../features/appointments/pages/AppointmentEdit";

// Reports and statistics
import Reports from "../features/reports/pages/Reports";

// Blog
import BlogList from "../features/blog/pages/BlogList";
import BlogCreate from "../features/blog/pages/BlogCreate";
import BlogEdit from "../features/blog/pages/BlogEdit";

// Owners
import OwnersList from "../features/owners/pages/OwnerList";
import OwnerCreate from "../features/owners/pages/OwnerCreate";
import OwnerEdit from "../features/owners/pages/OwnerEdit";
import OwnerDetail from "../features/owners/pages/OwnerDetail";

// Pets
import Pets from "../features/pets/pages/PetsList";
import PetCreate from "../features/pets/pages/PetCreate";
import PetDetail from "../features/pets/pages/PetDetail";
import PetEdit from "../features/pets/pages/PetEdit";

// Products and categories
import CategoryList from "../features/products/categories/pages/CategoryList";
import CategoryCreate from "../features/products/categories/pages/CategoryCreate";
import CategoryEdit from "../features/products/categories/pages/CategoryEdit";
import ProductList from "../features/products/pages/ProductList";
import ProductCreate from "../features/products/pages/ProductCreate";
import ProductEdit from "../features/products/pages/ProductEdit";

// Clinical history
import ClinicalHistoryList from "../features/clinical-history/pages/ClinicalHistoryList";
import ClinicalHistoryCreate from "../features/clinical-history/pages/ClinicalHistoryCreate";
import ClinicalHistoryDetail from "../features/clinical-history/pages/ClinicalHistoryDetail";
import ClinicalHistoryEdit from "../features/clinical-history/pages/ClinicalHistoryEdit";

// Users 
import UsersList from "../features/users/pages/UserList";
import UserCreate from "../features/users/pages/UserCreate";
import UserEdit from "../features/users/pages/UserEdit";

// Vaccination
import AppliedVaccineList from "../features/applied-vaccines/pages/AppliedVaccineList";
import AppliedVaccineCreate from "../features/applied-vaccines/pages/AppliedVaccineCreate";
import AppliedVaccineDetail from "../features/applied-vaccines/pages/AppliedVaccineDetail";
import AppliedVaccineEdit from "../features/applied-vaccines/pages/AppliedVaccineEdit";

/**
 * Application router defining all routes and their corresponding components.
 * @return {JSX.Element} The router component.
 */
const Router = () => (
  <AuthProvider>
    <Routes>
      {/* Login route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          {/* --- Owners --- */}
          <Route path="owners" element={<OwnersList />} />
          <Route path="owners/create" element={<OwnerCreate />} />
          <Route path="owners/:id/edit" element={<OwnerEdit />} />
          <Route path="owners/:id" element={<OwnerDetail />} />

          {/* --- Pets --- */}
          <Route path="pets" element={<Pets />} />
          <Route path="pets/create" element={<PetCreate />} />
          <Route path="pets/:id" element={<PetDetail />} />
          <Route path="pets/:id/edit" element={<PetEdit />} />

          {/* --- Appointments --- */}
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/create" element={<AppointmentCreate />} />
          <Route path="appointments/:id" element={<AppointmentDetail />} />
          <Route path="appointments/:id/edit" element={<AppointmentEdit />} />

          {/* --- Reports and statictics --- */}
          <Route path="reports" element={<Reports />} />

          {/* --- Blog --- */}
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogCreate />} />
          <Route path="blog/:id/edit" element={<BlogEdit />} />

          {/* --- Products --- */}
          <Route path="products/categories" element={<CategoryList />} />
          <Route path="products/categories/create" element={<CategoryCreate />} />
          <Route path="products/categories/edit/:id" element={<CategoryEdit />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />

          {/* --- Clinical history --- */}
          <Route path="clinical-history" element={<ClinicalHistoryList />} />
          <Route path="clinical-history/create" element={<ClinicalHistoryCreate />} />
          <Route path="clinical-history/:id" element={<ClinicalHistoryDetail />} />
          <Route path="clinical-history/:id/edit" element={<ClinicalHistoryEdit />} />

          {/* --- Vaccination --- */}
          <Route path="applied-vaccines" element={<AppliedVaccineList />} />
          <Route path="applied-vaccines/create" element={<AppliedVaccineCreate />} />
          <Route path="applied-vaccines/:id" element={<AppliedVaccineDetail />} />
          <Route path="applied-vaccines/:id/edit" element={<AppliedVaccineEdit />} />

          {/* --- Users --- */}
          <Route path="security" element={ 
            <AdminRoute> 
              <UsersList /> 
            </AdminRoute> 
            } />
          <Route path="security/create" element={
              <AdminRoute>
                <UserCreate />
              </AdminRoute>
            } />
          <Route path="security/:id/edit" element={
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
            } />
        </Route>
      </Route>

      {/* Default route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
);

export default Router;
