import { API_CONFIG } from '../config/api.config';

export const adminService = {
  async generateAdminCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem('auth_token');
      
      // Construct the full URL properly
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.GENERATE_CODE}`;
      console.log('Generating admin code with URL:', url); // Debug log
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate admin code');
      }
      
      return data;
    } catch (error) {
      console.error('Error generating admin code:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to generate admin code');
    }
  },

  async verifyAdminCode(code: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Construct the full URL properly
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.VERIFY_CODE}`;
      console.log('Verifying admin code with URL:', url); // Debug log
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify admin code');
      }
      
      return data;
    } catch (error) {
      console.error('Error verifying admin code:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to verify admin code');
    }
  }
};



