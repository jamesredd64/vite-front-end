import { useState, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import  UserMetadata  from '../types/user';
import { API_CONFIG } from '../config/api.config';

// Add this console log at the top of your file to verify the import
console.log('Imported API_CONFIG:', API_CONFIG);

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const TIMEOUT = 5000; // 5 seconds timeout

interface ApiError {
  message: string;
  status?: number;
}

interface UpdateUserData {
  email: string;
  name: string;
  auth0Id: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  extendedProps: {
    calendar: string;
  };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useMongoDbClient = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const requestInProgress = useRef<boolean>(false);
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);

  const getAuthHeaders = useCallback(async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://dev-uizu7j8qzflxzjpy.us.auth0.com/api/v2/',
        scope: 'openid profile email'
      }
    });
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, [getAccessTokenSilently]);

  const getUserById = useCallback(async (auth0Id: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(auth0Id)}`, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result; // Return the full response which includes user data
    } catch (error) {
      console.error('Error checking user existence:', error);
      return null;  // Return null instead of throwing error
    }
  }, [getAuthHeaders]);

  const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
      try {
        // Remove the API_BASE from the url parameter since we're adding it here
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server");
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await delay(RETRY_DELAY * Math.pow(2, i));
      }
    }
  };

  // const updateUser = useCallback(async (userId: string, userData: Partial<UserMetadata>) => {
  //   setLoading(true);
  //   setError(null);
    
  //   try {
  //     const headers = await getAuthHeaders();
  //     // Remove API_BASE from the URL since fetchWithRetry adds it
  //     const response = await fetchWithRetry(`/users/${userId}`, {
  //       method: 'PUT',
  //       headers: {
  //         ...headers,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(userData)
  //     });

  //     return response;
  //   } catch (err) {
  //     const apiError: ApiError = {
  //       message: err instanceof Error ? err.message : 'An unknown error occurred',
  //       status: err instanceof Error ? undefined : 500,
  //     };
  //     setError(apiError);
  //     throw apiError;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [getAuthHeaders]);

  const getUserByEmail = useCallback(async (email: string) => {
    setLoading(true);
    try {
      setError(null);
      
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_EMAIL(email)}`, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }

      return await response.json();
    } catch (err) {
      console.error('Error in getUserByEmail:', err);
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const createUser = useCallback(async (userData: Partial<UserMetadata>) => {
    setLoading(true);
    try {
      setError(null);
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error in createUser:', err);
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const checkAndInsertUser = async (auth0Id: string, userData: any) => {
    console.group('checkAndInsertUser Operation');
    try {
      console.log('Input Parameters:', {
        auth0Id,
        userData: JSON.stringify(userData, null, 2)
      });

      const headers = await getAuthHeaders();
      
      // Ensure proper URL construction
      const baseUrl = `https://${API_CONFIG.BASE_URL}`;
      const createUrl = `${baseUrl}${API_CONFIG.ENDPOINTS.USERS}`;
      console.log('Creating user at:', createUrl);
      
      const newUserData = {
        ...userData,
        auth0Id,
        createdAt: new Date().toISOString()
      };
      console.log('New user payload:', JSON.stringify(newUserData, null, 2));

      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData)
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create user. Status: ${createResponse.status}`);
      }

      return await createResponse.json();
    } catch (error) {
      console.error('Error in checkAndInsertUser:', error);
      throw error;
    }
  };
  
  const updateUser = useCallback(async (auth0Id: string, userData: {
    email: string;
    name: string;
    firstName: string;
    lastName: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting to update/create user:', userData);
      const userDataWithAuth = {
        ...userData,
        auth0Id,
      };
      console.log('Sending data to server:', JSON.stringify(userDataWithAuth));
      const updatedUser = await checkAndInsertUser(auth0Id, userDataWithAuth);
      console.log('User successfully handled:', updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Error handling user update/creation:', err);
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        status: err instanceof Error ? undefined : 500,
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);
  
  
  // const checkAndInsertUser = async (auth0Id: string, userData: Partial<UserMetadata>) => {
  //   // Fetch API to check if the user exists
  //   const headers = await getAuthHeaders();
  
  //   const checkResponse = await fetch(`/users/${encodeURIComponent(auth0Id)}`, {
  //     method: 'GET',
  //     headers: {
  //       ...headers,
  //       'Content-Type': 'application/json',
  //     },
  //   });
  
  //   if (checkResponse.status === 200) {
  //     // User exists, return the existing user data
  //     const user = await checkResponse.json();
  //     console.log('User exists:', user);
  //     return user;
  //   } else if (checkResponse.status === 404) {
  //     // User does not exist, create a new one
  //     console.log('User not found. Attempting to create a new user...');
  
  //     const createResponse = await fetch(`/users`, {
  //       method: 'POST',
  //       headers: {
  //         ...headers,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         auth0Id,
  //         ...userData,
  //       }),
  //     });
  
  //     if (!createResponse.ok) {
  //       throw new Error(`Failed to create user. Status: ${createResponse.status}`);
  //     }
  
  //     const newUser = await createResponse.json();
  //     console.log('User successfully created:', newUser);
  //     return newUser;
  //   } else {
  //     throw new Error(`Unexpected status code: ${checkResponse.status}`);
  //   }
  // };
  
  // const updateUser = useCallback(async (auth0Id: string, userData: Partial<UserMetadata>) => {
  //   setLoading(true);
  //   setError(null);
  
  //   try {
  //     // Call the function to check and insert/update the user
  //     const updatedUser = await checkAndInsertUser(auth0Id, userData);
  //     console.log('User successfully handled:', updatedUser);
  //     return updatedUser;
  //   } catch (err) {
  //     console.error('Error handling user update/creation:', err);
  //     const apiError: ApiError = {
  //       message: err instanceof Error ? err.message : 'An unknown error occurred',
  //       status: err instanceof Error ? undefined : 500,
  //     };
  //     setError(apiError);
  //     throw apiError;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [getAuthHeaders]);
  
  const saveUserData = useCallback(async (auth0Id: string, userData: Partial<UserMetadata>) => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      
      // Add these debug logs here
      console.log('Save URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SAVE_USER_DATA(auth0Id)}`);
      console.log('API_CONFIG:', API_CONFIG);
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SAVE_USER_DATA(auth0Id)}`,
        {
          method: 'PUT',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save user data. Status: ${response.status}`);
      }

      const updatedUser = await response.json();
      console.log('User data saved successfully:', updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Error saving user data:', err);
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        status: err instanceof Error ? undefined : 500,
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchWithTimeout = async (url: string, options: RequestInit) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  const fetchUserData = useCallback(async (userId: string) => {
    if (requestInProgress.current) return null;
    
    requestInProgress.current = true;
    setLoading(true);
    
    try {
      const headers = await getAuthHeaders();
      console.log('Fetching user data for ID:', userId);
      const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(userId)}`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('MongoDB Response:', data); // Add this log
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError({
        message: error instanceof Error ? error.message : 'Failed to fetch user data',
        status: error instanceof Response ? error.status : undefined
      });
      return null;
    } finally {
      setLoading(false);
      requestInProgress.current = false;
    }
  }, [getAccessTokenSilently]);

  const fetchCalendarEvents = useCallback(async (userId: string) => {
    console.group('Fetching Calendar Events');
    try {
      // Ensure we're using the full auth0 ID format
      const auth0Id = userId.startsWith('auth0|') ? userId : `auth0|${userId}`;
      console.log('Fetching events for auth0Id:', auth0Id);
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_CALENDAR_EVENTS(auth0Id)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Calendar API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const events = await response.json();
      console.log('Fetched calendar events:', events);
      return events as CalendarEvent[];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    } finally {
      console.groupEnd();
    }
  }, []);

  return { 
    fetchUserData, 
    error, 
    loading, 
    updateUser, 
    getUserById, 
    checkAndInsertUser, 
    saveUserData,
    fetchCalendarEvents
  };
};
