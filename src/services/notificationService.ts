import { API_CONFIG } from '../config/api.config';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAuth0 } from '@auth0/auth0-react';

export interface NotificationRead {
  userId: string;
  readAt: Date;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: string;
  recipients: string[];
  read: NotificationRead[];
  senderProfilePic?: string;
  updatedAt?: string;
  __v?: number;
}

export const notificationService = {
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${encodeURIComponent(userId)}/unread`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched Unread Notifications:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getUnreadNotifications:', error);
      return [];
    }
  },

  async getAllUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/user/${encodeURIComponent(userId)}/all`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log('Fetched all Notifications:');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched All User Notifications:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getAllUserNotifications:', error);
      return [];
    }
  },
  
  async createNotification(data: {
    title: string;
    message: string;
    type: 'all' | 'selected';
    recipients?: string[];
    senderProfilePic?: string;
  }, auth0Id: string): Promise<Notification> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      console.log('Creating notification with auth0Id:', auth0Id);
      
      const payload = {
        ...data,
        auth0Id,
        recipients: data.recipients || [],
        createdBy: auth0Id
      };
      
      console.log('Request payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error in createNotification:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };

    console.log('Marking notification as read:', {
      notificationId,
      userId,
      endpoint: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`
    });

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({ userId })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Successfully marked as read:', result);
      return result;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      throw error;
    }
  }
};



