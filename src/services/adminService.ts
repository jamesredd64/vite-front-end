// services/admin.service.ts
import { API_CONFIG } from '../config/api.config';
import type { AdminSettings, AdminSettingsResponse } from '../types/rbac.types';
import { useAccessToken } from '../services/auth.token.service';

export const useAdminService = () => {
  const { getToken } = useAccessToken();

  const getAdminSettings = async (): Promise<AdminSettingsResponse> => {
    try {
      console.log('🚀 Starting getAdminSettings');
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.SETTINGS}`;
      const token = await getToken();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch admin settings');
      return data;
    } catch (error) {
      console.error('❌ Error in getAdminSettings:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const saveAdminSettings = async (settings: AdminSettings): Promise<AdminSettingsResponse> => {
    try {
      console.log('🚀 Starting saveAdminSettings');
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.SETTINGS}`;
      const token = await getToken();

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save admin settings');
      return data;
    } catch (error) {
      console.error('❌ Error in saveAdminSettings:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const overwriteAllAdminSettings = async (settings: AdminSettings): Promise<AdminSettingsResponse> => {
    try {
      console.log('🚀 Starting overwriteAllAdminSettings');
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.OVERWRITE_ALL}`;
      const token = await getToken();

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to overwrite admin settings');
      return data;
    } catch (error) {
      console.error('❌ Error in overwriteAllAdminSettings:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return {
    getAdminSettings,
    saveAdminSettings,
    overwriteAllAdminSettings
  };
};


// import { API_CONFIG } from '../config/api.config';
// // import { useApi } from '../services/api.service'; // Import useApi hook
// import type { AdminSettings, AdminSettingsResponse } from '../types/rbac.types'; // Import types
// import { useAuth0 } from '@auth0/auth0-react';


// export const adminService = {
  
//   async getAdminSettings(getTokenSilently: () => Promise<string>): Promise < AdminSettingsResponse > {
//     try {
//       console.log('🚀 Starting getAdminSettings');
//       const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.SETTINGS}`;
//       console.log('🔍 Fetching admin settings from:', url);
      
//       const token = await getTokenSilently();
//       console.log('🔑 Using token:', token.substring(0, 20) + '...'); // Log first 20 chars for debugging
//       console.log('🔑 Full token:', token); 
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       console.log('🌐 Response status:', response.status);
      
//       const data = await response.json();
//       console.log('✅ Received data:', data);
      
//       return data;
//     } catch (error) {
//       console.error('❌ Error in getAdminSettings:', error);
//       console.error('❌ Error details:', {
//         message: error instanceof Error ? error.message : 'Unknown error',
//         stack: error instanceof Error ? error.stack : undefined
//       });
//       throw new Error(error instanceof Error ? error.message : 'Failed to fetch admin settings');
//     }
//   },

//   // New function to save admin settings
//   async saveAdminSettings(settings: AdminSettings, getTokenSilently: () => Promise<string>): Promise<AdminSettingsResponse> {
//     try {
//       console.log('🚀 Starting saveAdminSettings');
//       const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.SETTINGS}`;
//       console.log('💾 Saving admin settings to:', url);
      
//       const token = await getTokenSilently();
//       console.log('🔑 Using token:', token.substring(0, 20) + '...'); // Log first 20 chars for debugging
      
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(settings)
//       });
//       console.log('🌐 Response status:', response.status);
      
//       const data = await response.json();
//       console.log('✅ Received data:', data);
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to save admin settings');
//       }
      
//       return data;
//     } catch (error) {
//       console.error('❌ Error in saveAdminSettings:', error);
//       console.error('❌ Error details:', {
//         message: error instanceof Error ? error.message : 'Unknown error',
//         stack: error instanceof Error ? error.stack : undefined
//       });
//       throw new Error(error instanceof Error ? error.message : 'Failed to save admin settings');
//     }
//   },

//   async overwriteAllAdminSettings(settings: AdminSettings, getTokenSilently: () => Promise<string>): Promise<AdminSettingsResponse> {
//     try {
//       console.log('🚀 Starting saveAdminSettings');
//       const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.OVERWRITE_ALL}`;
//       // const response = await axios.put('/settings/overwriteAll', updatedSettings, 
//       console.log('💾 Saving admin settings to:', url);
      
//       const token = await getTokenSilently();
//       console.log('🔑 Using token:', token.substring(0, 20) + '...'); // Log first 20 chars for debugging
      
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(settings)
//       });
//       console.log('🌐 Response status:', response.status);
      
//       const data = await response.json();
//       console.log('✅ Received data:', data);
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to save admin settings');
//       }
      
//       return data;
//     } catch (error) {
//       console.error('❌ Error in saveAdminSettings:', error);
//       console.error('❌ Error details:', {
//         message: error instanceof Error ? error.message : 'Unknown error',
//         stack: error instanceof Error ? error.stack : undefined
//       });
//       throw new Error(error instanceof Error ? error.message : 'Failed to save admin settings');
//     }
//   }

 
  
// };

  

