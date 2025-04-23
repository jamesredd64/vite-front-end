/* eslint-disable react-refresh/only-export-components */
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

// Re-export useAdminSettings for backward compatibility
export { useAdminSettings } from '../hooks/useAdminSettings';

export const AdminRoute = () => {
  const isAdmin = useAdmin();

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
