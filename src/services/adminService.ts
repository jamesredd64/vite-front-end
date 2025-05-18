import { API_CONFIG } from '../config/api.config';
// import { useApi } from '../services/api.service'; // Import useApi hook
import type { AdminSettings, AdminSettingsResponse } from '../types/rbac.types'; // Import types

export const adminService = {
  // async generateAdminCode(email: string): Promise<{ success: boolean; message: string }> {
  //   try {
  //     // Get the auth token from localStorage
  //     const token = localStorage.getItem('auth_token');
      
  //     // Construct the full URL properly
  //     const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.GENERATE_CODE}`;
  //     console.log('Generating admin code with URL:', url); // Debug log
      
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({ email })
  //     });
      
  //     const data = await response.json();
      
  //     if (!response.ok) {
  //       throw new Error(data.message || 'Failed to generate admin code');
  //     }
      
  //     return data;
  //   } catch (error) {
  //     console.error('Error generating admin code:', error);
  //     throw new Error(error instanceof Error ? error.message : 'Failed to generate admin code');
  //   }
  // },

  // async verifyAdminCode(code: string): Promise<{ success: boolean; message: string }> {
  //   try {
  //     const token = localStorage.getItem('auth_token');
      
  //     // Construct the full URL properly
  //     const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.VERIFY_CODE}`;
  //     console.log('Verifying admin code with URL:', url); // Debug log
      
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({ code })
  //     });
      
  //     const data = await response.json();
      
  //     if (!response.ok) {
  //       throw new Error(data.message || 'Failed to verify admin code');
  //     }
      
  //     return data;
  //   } catch (error) {
  //     console.error('Error verifying admin code:', error);
  //     throw new Error(error instanceof Error ? error.message : 'Failed to verify admin code');
  //   }
  // },

  // New function to fetch admin settings
  
  async getAdminSettings(getTokenSilently: () => Promise<string>): Promise<AdminSettingsResponse> {
    try {
      console.log('🚀 Starting getAdminSettings');
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.SETTINGS}`;
      console.log('🔍 Fetching admin settings from:', url);
      
      const token = await getTokenSilently();
      console.log('🔑 Using token:', token.substring(0, 20) + '...'); // Log first 20 chars for debugging
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('🌐 Response status:', response.status);
      
      const data = await response.json();
      console.log('✅ Received data:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error in getAdminSettings:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch admin settings');
    }
  }
};



