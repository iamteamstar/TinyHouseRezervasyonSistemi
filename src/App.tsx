import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ROUTES } from './utils/constants';
import { Role } from './types';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HouseListPage from './pages/house/HouseListPage';
import HouseDetailPage from './pages/house/HouseDetailPage';
import AddHousePage from './pages/house/AddHousePage';
import EditHousePage from './pages/house/EditHousePage';
import ReservationPage from './pages/reservation/ReservationPage';
import UserReservationsPage from './pages/reservation/UserReservationsPage';
import OwnerReservationsPage from './pages/reservation/OwnerReservationsPage';
import AdminReservationsPage from './pages/reservation/AdminReservationsPage';
import AddReviewPage from './pages/review/AddReviewPage';
import ManageAvailabilityPage from './pages/availability/ManageAvailabilityPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './components/admin/AdminPage';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route
  path={ROUTES.ADMIN_USERS}
  element={
    <ProtectedRoute allowedRoles={[Role.Admin]}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
          {/* Protected routes for all authenticated users */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.HOUSES} element={<HouseListPage />} />
          <Route path={ROUTES.HOUSE_DETAILS} element={<HouseDetailPage />} />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          {/* House Owner and Admin routes */}
          <Route
            path={ROUTES.ADD_HOUSE}
            element={
              <ProtectedRoute allowedRoles={[Role.Admin, Role.HouseOwner]}>
                <AddHousePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EDIT_HOUSE}
            element={
              <ProtectedRoute allowedRoles={[Role.Admin, Role.HouseOwner]}>
                <EditHousePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.OWNER_RESERVATIONS}
            element={
              <ProtectedRoute allowedRoles={[Role.Admin, Role.HouseOwner]}>
                <OwnerReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MANAGE_AVAILABILITY}
            element={
              <ProtectedRoute allowedRoles={[Role.Admin, Role.HouseOwner]}>
                <ManageAvailabilityPage />
              </ProtectedRoute>
            }
          />
          
          {/* Tenant routes */}
          <Route
            path={ROUTES.RESERVATIONS}
            element={
              <ProtectedRoute allowedRoles={[Role.Tenant]}>
                <UserReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ROUTES.HOUSE_DETAILS}/reserve`}
            element={
              <ProtectedRoute allowedRoles={[Role.Tenant]}>
                <ReservationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADD_REVIEW}
            element={
              <ProtectedRoute allowedRoles={[Role.Tenant]}>
                <AddReviewPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin routes */}
          <Route
            path={ROUTES.ADMIN_RESERVATIONS}
            element={
              <ProtectedRoute allowedRoles={[Role.Admin]}>
                <AdminReservationsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404\" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;