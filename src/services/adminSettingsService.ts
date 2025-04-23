import { API_CONFIG } from '../config/api.config';
import { AdminSettings } from '../types/settings';

export const adminSettingsService = {
  async getSettings(getToken: () => Promise<string>): Promise<AdminSettings> {
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const url = `${API_CONFIG.BASE_URL}/admin/settings`;
      
      console.log('🔍 Fetching admin settings:', { url });

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (response.status === 401) {
        throw new Error('Authentication token expired or invalid');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch admin settings');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching admin settings:', error);
      throw error;
    }
  },

  async updateSettings(
    section: keyof AdminSettings,
    data: Partial<AdminSettings[keyof AdminSettings]>,
    getToken: () => Promise<string>
  ): Promise<AdminSettings> {
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const url = `${API_CONFIG.BASE_URL}/admin/settings`;
      
      console.log('🔍 Attempting to update admin settings:', {
        url,
        section,
      });

      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          section,
          data
        })
      });

      if (response.status === 401) {
        throw new Error('Authentication token expired or invalid');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update admin settings');
      }

      const updatedData = await response.json();
      return updatedData.data;
    } catch (error) {
      console.error('Error updating admin settings:', error);
      throw error;
    }
  }
};






