import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import Users from '../pages/admin/Users';
import CreateNotification from '../pages/CreateNotification';

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/notifications/create" element={<CreateNotification />} />
        {/* Add other admin routes here */}
      </Routes>
    </AdminLayout>
  );
}
