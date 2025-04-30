import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import SignedOut from './pages/SignedOut';
import Unauthorized from './pages/Unauthorized';
import AdminLayout from './layout/AdminLayout';
import AppLayout from './layout/AppLayout';
import AdminDashboard from './pages/AdminDashboard';
import Calendar from './pages/Calendar';
import MarketingOverview from './pages/MarketingOverview';
import CustomerDemographics from './pages/CustomerDemographics';
import Changelog from './pages/Changelog';
import UserAdmin from './pages/UserAdmin';
import EventInvitation from './pages/EventInvitation';
import UserDashboard from './pages/UserDashboard';
import NewUserWelcome from './pages/NewUserWelcome';
import ProfilePage from './pages/ProfilePage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Signed Out */}
      <Route path="/signed-out" element={<SignedOut />} />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute 
            element={<AdminLayout />} 
            requireAdmin={true} 
          />
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="marketing-overview" element={<MarketingOverview />} />
        <Route path="customer-demographics" element={<CustomerDemographics />} />
        <Route path="changelog" element={<Changelog />} />
        <Route path="users" element={<UserAdmin />} />
        <Route path="invite" element={<EventInvitation />} />
      </Route>

      {/* User Routes */}
      <Route 
        path="/user/*" 
        element={
          <ProtectedRoute 
            element={<AppLayout />} 
            requireAdmin={false} 
          />
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="welcome-new" element={<NewUserWelcome />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Redirect root to appropriate dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute
            element={
              localStorage.getItem('userRole') === 'admin' || 
              localStorage.getItem('userRole') === 'super-admin' 
                ? <Navigate to="/admin" replace /> 
                : <Navigate to="/user" replace />
            }
            requireAdmin={false}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
