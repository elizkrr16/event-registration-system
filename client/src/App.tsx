import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AccountPage } from './pages/AccountPage';
import { AdminEventFormPage } from './pages/AdminEventFormPage';
import { AdminEventsPage } from './pages/AdminEventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { EventsCatalogPage } from './pages/EventsCatalogPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsCatalogPage />} />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/new"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEventFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/:eventId/edit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEventFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
