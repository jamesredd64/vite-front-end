import { API_CONFIG } from '../config/api.config';
import { useAuth0 } from '@auth0/auth0-react';

interface EmailData {
  to: string | string[];
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
  }>;
}

export const useEmailService = () => {
  const { getAccessTokenSilently } = useAuth0();

  const sendEmail = async (emailData: EmailData) => {
    try {
      // Changed to match the working endpoint
      const apiUrl = `${API_CONFIG.BASE_URL}/email`;
      console.log('Sending email request to:', apiUrl);
      console.log('Email data:', emailData);

      const token = await getAccessTokenSilently();
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        console.error('Email API response error:', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  return { sendEmail };
};




