import { Route, Routes } from 'react-router-dom';
import CreateNotification from '../pages/admin/CreateNotification';
import AdminLayout from '../layouts/AdminLayout';

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/notifications/create" element={<CreateNotification />} />
        {/* Other admin routes */}
      </Routes>
    </AdminLayout>
  );
}