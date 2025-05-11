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
  organizer?: { // Make organizer optional as it might not be needed for every attendee in bulk
    name: string;
    email: string | undefined; // Allow email to be undefined
  };
  // 'to' is not needed in the bulk send eventDetails
}

export class EmailService {
  // Updated to match the backend's bulk send endpoint expectations
  static async sendEventInvitation(eventDetails: EventDetails, attendees: Attendee[] = []): Promise<void> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENT_INVITATION}`,
        {
          eventDetails,
          attendees // Send the attendees array (will be empty array if not provided)
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

      console.log(`Event invitation process initiated successfully.`);
    } catch (error) {
      console.error(`Error sending event invitation:`, error);
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







