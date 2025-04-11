import { API_CONFIG } from '../config/api.config';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'all' | 'selected';
  recipients: string[];
  read: Array<{
    userId: string;
    readAt: Date;
  }>;
  createdAt: Date;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export const notificationService = {
  async getUserNotifications(userId: string): Promise<Notification[]> {
    console.log('Trying notificationService'); // Initial render log
    return fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_NOTIFICATIONS(userId)}`
    ).then(res => res.json());
  },
  
  async createNotification(data: {
    title: string;
    message: string;
    type: 'all' | 'selected';
    recipients?: string[];
  }): Promise<Notification> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    return fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      }
    ).then(res => res.json());
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    return fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`,
      {
        method: 'PUT',
        headers
      }
    ).then(res => res.json());
  }
};



