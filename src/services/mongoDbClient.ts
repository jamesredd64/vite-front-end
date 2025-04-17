import { useState, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import  UserMetadata  from '../types/user';
import { API_CONFIG } from '../config/api.config';
import { CalendarEvent, CalendarApiResponse } from '../types/calendar.types';

// const MAX_RETRIES = 2;
// const RETRY_DELAY = 1000;
const TIMEOUT = 5000; // 5 seconds timeout


interface ApiError {
  message: string;
  status?: number;
}

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const normalizeAuthId = (auth0Id: string): string => {
  return auth0Id;
};

export const useMongoDbClient = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const requestInProgress = useRef<boolean>(false);
  // const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://dev-uizu7j8qzflxzjpy.us.auth0.com/api/v2/',
        scope: 'openid profile email'
      }
    });
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
  }, [getAccessTokenSilently]);

  const getUserById = useCallback(async (auth0Id: string) => {
    // Don't make API calls if not authenticated
    if (!isAuthenticated) {
      console.debug('Skipping API call - user not authenticated');
      return null;
    }

    console.group('getUserById Operation');
    try {
      const headers = await getAuthHeaders();
      const normalizedId = normalizeAuthId(auth0Id);
      const encodedAuth0Id = encodeURIComponent(normalizedId);
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(encodedAuth0Id)}`;
      
      console.log('Original auth0Id:', auth0Id);
      console.log('Normalized auth0Id:', normalizedId);
      console.log('Fetching from URL:', url);
      console.log('Headers:', headers);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
  
      console.log('Response status:', response.status);
  
      // Handle 204 No Content
      if (response.status === 204) {
        console.log('No user found');
        return null;
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('User data received:', result);
      return result;
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  }, [isAuthenticated, getAuthHeaders]);

  const checkAndInsertUser = useCallback(async (userId: string, userData: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profile?: {
      dateOfBirth?: string | null;
      gender?: string;
      profilePictureUrl?: string;
      role?: string;
    },
    marketingBudget?: {
      adBudget?: number;
      costPerAcquisition?: number;
      dailySpendingLimit?: number;
      marketingChannels?: string;
      monthlyBudget?: number;
      preferredPlatforms?: string;
      notificationPreferences?: string[];
      roiTarget?: number;
      frequency?: "daily" | "monthly" | "quarterly" | "yearly";
    },
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    }
  }): Promise<unknown> => {
    console.group('checkAndInsertUser Operation');
    try {
      const headers = await getAuthHeaders();
      
      const createUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`;
      console.log('Creating user at:', createUrl);
      
      const newUserData = {
        ...userData,
        auth0Id: userId,  // Store the original Auth0 ID without modification
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
  }, [getAuthHeaders]);
  
  const updateUser = useCallback(async (auth0Id: string, userData: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profile?: {
      dateOfBirth?: string | null;
      gender?: string;
      profilePictureUrl?: string;
      role?: 'admin' | 'user' | 'manager' | 'super-admin';
    };
    marketingBudget?: {
      adBudget?: number;
      costPerAcquisition?: number;
      dailySpendingLimit?: number;
      marketingChannels?: string;
      monthlyBudget?: number;
      preferredPlatforms?: string;
      notificationPreferences?: string[];
      roiTarget?: number;
      frequency?: "daily" | "monthly" | "quarterly" | "yearly";
    };    
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  }) => {
    setLoading(true);
    setError(null);

    try {
      console.group('mongoDbClient - updateUser');
      console.log('Initial userData received:', userData);
      console.log('Initial marketingBudget:', userData.marketingBudget);
      
      // First, get the existing user data
      const existingUser = await getUserById(auth0Id);
      console.log('Existing user data:', existingUser);
      console.log('Existing marketingBudget:', existingUser?.marketingBudget);
      
      // Remove the merge since we're sending complete data
      const userDataWithAuth = {
        ...userData,
        auth0Id,
        marketingBudget: userData.marketingBudget || {},  // Keep at root level
        profile: {
          ...(existingUser?.profile || {}),
          ...(userData.profile || {}),
          role: userData.profile?.role || existingUser?.profile?.role || 'user', // Always provide a role
          profilePictureUrl: userData.profile?.profilePictureUrl || existingUser?.profile?.profilePictureUrl || ''
        }
      };
      
      console.log('Final userData being sent to server:', userDataWithAuth);
      console.log('Final marketingBudget being sent:', userDataWithAuth.marketingBudget);
      
      const updatedUser = await checkAndInsertUser(auth0Id, userDataWithAuth);
      console.log('Response from server:', updatedUser);
      console.groupEnd();
      
      return updatedUser;
    } catch (err) {
      console.error('Error in updateUser:', err);
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        status: err instanceof Error ? undefined : 500,
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [checkAndInsertUser, getUserById]);
  

  const saveUserData = async (auth0Id: string, data: Partial<UserMetadata>, section?: 'meta' | 'address' | 'marketing') => {
    try {
      let endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SAVE_USER_DATA(auth0Id)}`;
      if (section) {
        endpoint += `?section=${section}`;
      }

      const headers = await getAuthHeaders();
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to save user data. Status: ${response.status}`);
      }

      const serverResponse = await response.json();
      return serverResponse;
    } catch (error) {
      console.error('Error in saveUserData:', error);
      throw error;
    }
  };

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAccessTokenSilently]);

  const fetchCalendarEvents = useCallback(async (userId: string): Promise<CalendarEvent[]> => {
    const normalizedId = normalizeAuthId(userId);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_CALENDAR_EVENTS(normalizedId)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data?.events || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAuthHeaders]);

  const createCalendarEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    const dbEventData = {
      ...eventData,
      auth0Id: eventData.auth0Id
    };

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/calendar`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbEventData)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CalendarApiResponse = await response.json();
      if (!data.event) {
        throw new Error('No event data returned');
      }
      return data.event;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create event');
    }
  }, []);

  const updateCalendarEvent = useCallback(async (eventId: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/calendar/${eventId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CalendarApiResponse = await response.json();
      if (!data.event) {
        throw new Error('No event data returned');
      }
      return data.event;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update event');
    }
  }, []);

  const deleteCalendarEvent = useCallback(async (eventId: string): Promise<void> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/calendar/${eventId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete event');
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
    fetchCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent
  };
}; 
  

  
  

