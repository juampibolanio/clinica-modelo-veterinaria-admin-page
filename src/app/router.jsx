import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '../features/auth/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import Login from '../pages/Login';
import DashboardHome from '../pages/DashboardHome';
import Owners from '../pages/Owners';
import Pets from '../pages/Pets';
import Appointments from '../pages/Appointments';
import Stock from '../pages/Stock';
import Reports from '../pages/Reports';
import Security from '../pages/Security';
import { bindAuth } from '../libs/axios';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const BindAuthToAxios = ({ children }) => {
  const { token, logout } = useAuth();
  bindAuth({ token, logout });
  return children;
};

const Router = () => (
  <AuthProvider>
    <BindAuthToAxios>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/owners"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Owners />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pets"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Pets />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Appointments />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Stock />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/security"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Security />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BindAuthToAxios>
  </AuthProvider>
);

export default Router;
