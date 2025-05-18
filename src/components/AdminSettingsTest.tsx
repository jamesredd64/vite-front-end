import { adminService } from '../services/adminService';
import { useAuth0 } from '@auth0/auth0-react';

export default function AdminSettingsTest() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const testGetAdminSettings = async () => {
    try {
      if (!isAuthenticated) {
        console.error('❌ Not authenticated');
        return;
      }

      console.log('🚀 Starting test');
      const settings = await adminService.getAdminSettings(getAccessTokenSilently);
      console.log('✅ Success:', settings);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to test admin settings</div>;
  }

  return (
    <div>
      <h1>Admin Settings Test</h1>
      <button onClick={testGetAdminSettings}>
        Get Admin Settings
      </button>
    </div>
  );
}
