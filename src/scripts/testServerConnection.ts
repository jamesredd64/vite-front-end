import { API_CONFIG } from '../config/api.config';

const testServerConnection = async () => {
  try {
    console.log('Attempting to connect to server...');
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HELLO}`;
    console.log('Trying to connect to:', url);
    
    const response = await fetch(url);
    
    // Log the raw response
    const text = await response.text();
    console.log('Raw response:', text);
    
    // Try to parse if it looks like JSON
    if (text.startsWith('{')) {
      const data = JSON.parse(text);
      console.log('Parsed response:', data);
    }
  } catch (error) {
    console.error('Connection Error:', error);
  }
};

// Run the test
testServerConnection();