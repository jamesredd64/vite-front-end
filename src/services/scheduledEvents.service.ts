import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

export class scheduledEvents {
  // Updated to match the backend's bulk send endpoint expectations
  static async getAllScheduledEvents(): Promise<any[]> { // Adjust return type as needed
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCHEDULED_EVENTS}`
      );

      if (!response.data) {
        throw new Error('Failed to fetch scheduled events: No data received');
      }

      // Assuming the backend returns an array of events directly
      return response.data;
    } catch (error) {
      console.error('Error fetching scheduled events:', error);
      throw error;
    }
  }
}






