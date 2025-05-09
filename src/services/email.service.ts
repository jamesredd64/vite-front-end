import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

interface Attendee {
  name: string;
  email: string;
}

interface EventDetails {
  startTime: Date;
  endTime: Date;
  summary: string;
  description: string;
  location: string;
  organizer: {
    name: string;
    email: string;
  };
  to: Attendee;
}

export class EmailService {
  static async sendEventInvitation(eventData: EventDetails, mailOptions: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
    icalEvent?: {
      filename: string;
      method: string;
      content: string;
    };
  }): Promise<void> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENT_INVITATION}`,
        {
          eventData,
          mailOptions
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to send invitation');
      }

      console.log(`Email sent to ${eventData.to.email}`);
    } catch (error) {
      console.error(`Error sending email to ${eventData.to.email}:`, error);
      throw error;
    }
  }

  static async sendBulkEventInvitations(eventDetails: Omit<EventDetails, 'to'>, attendees: Attendee[]): Promise<void> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BULK_EVENT_INVITATION}`,
        {
          eventDetails,
          attendees
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to send bulk invitations');
      }
    } catch (error) {
      console.error('Error sending bulk invitations:', error);
      throw error;
    }
  }
}







