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
  organizer?: { 
    name: string;
    email?: string; // Optional email
 
  };
}

export class EmailService {

  static async sendEventInvitation(eventDetails: EventDetails, attendees: Attendee[] = [], getAccessTokenSilently: () => Promise<string>): Promise<void> {
    if (!attendees || attendees.length === 0) {
      throw new Error('No attendees provided for event invitation');
    }

    if (!eventDetails.summary || !eventDetails.description) {
      throw new Error('Event details must include both summary and description');
    }
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEND_BULK_EMAIL}`,
        { 
          emails: attendees.map(attendee => attendee.email),
          subject: eventDetails.summary,
          body: eventDetails.description
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getAccessTokenSilently()}`
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to send invitation');
      }

      console.log('Event invitation process initiated successfully.');
      console.log('Event invitation process initiated successfully.');
    } catch (error) {
      console.error('Error sending event invitation:', error);
      console.error('Error sending event invitation:', error);
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

  static async sendBulkEmails(emails: string[], subject: string, body: string): Promise<void> {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEND_BULK_EMAIL}`,
        { emails, subject, body },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to send bulk emails');
      }

      console.log('Bulk emails sent successfully.');
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      throw error;
    }
  }
}











