import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthContext";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import Login from "../pages/Login";
import DashboardHome from "../pages/DashboardHome";

// Módulos principales
import Appointments from "../pages/Appointments";
import Reports from "../pages/Reports";
import Security from "../pages/Security";

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

// Clinical History
import ClinicalHistoryList from "../features/clinical-history/pages/ClinicalHistoryList";
import ClinicalHistoryCreate from "../features/clinical-history/pages/ClinicalHistoryCreate";
import ClinicalHistoryDetail from "../features/clinical-history/pages/ClinicalHistoryDetail";
import ClinicalHistoryEdit from "../features/clinical-history/pages/ClinicalHistoryEdit";

const Router = () => (
  <AuthProvider>
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          {/* Dueños */}
          <Route path="owners" element={<OwnersList />} />
          <Route path="owners/create" element={<OwnerCreate />} />
          <Route path="owners/:id/edit" element={<OwnerEdit />} />
          <Route path="owners/:id" element={<OwnerDetail />} />

          {/* Mascotas */}
          <Route path="pets" element={<Pets />} />
          <Route path="pets/create" element={<PetCreate />} />
          <Route path="pets/:id" element={<PetDetail />} />
          <Route path="pets/:id/edit" element={<PetEdit />} />

          {/* Turnos, reportes y seguridad */}
          <Route path="appointments" element={<Appointments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="security" element={<Security />} />

          {/* Blog */}
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogCreate />} />
          <Route path="blog/:id/edit" element={<BlogEdit />} />

          {/* Categories Productos (antes Stock) */}
          <Route path="products/categories" element={<CategoryList />} />
          <Route path="products/categories/create" element={<CategoryCreate />} />
          <Route path="products/categories/edit/:id" element={<CategoryEdit />} />


          {/* Productos */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />

          {/* Clinical History */}
          <Route path="/clinical-history" element={<ClinicalHistoryList />} />
          <Route path="/clinical-history/create" element={<ClinicalHistoryCreate />} />
          <Route path="/clinical-history/:id" element={<ClinicalHistoryDetail />} />
          <Route path="/clinical-history/:id/edit" element={<ClinicalHistoryEdit />} />
        </Route>
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
);

export default Router;
