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
  
  // Enhanced request cache with type safety
  interface CacheEntry<T> {
    promise: Promise<T>;
    timestamp: number;
  }
  
  const requestCache = useRef<Map<string, CacheEntry<unknown>>>(new Map());
  const CACHE_TIMEOUT = 5000; // 5 seconds cache timeout

  // Utility function for cache management
  const getCachedRequest = <T>(cacheKey: string): Promise<T> | null => {
    const cached = requestCache.current.get(cacheKey);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_TIMEOUT) {
      requestCache.current.delete(cacheKey);
      return null;
    }

    return cached.promise as Promise<T>;
  };

  const setCachedRequest = <T>(cacheKey: string, promise: Promise<T>) => {
    requestCache.current.set(cacheKey, {
      promise,
      timestamp: Date.now()
    });

    // Cleanup cache entry after completion or error
    promise.finally(() => {
      setTimeout(() => {
        requestCache.current.delete(cacheKey);
      }, CACHE_TIMEOUT);
    });
  };

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
    if (!isAuthenticated) {
      // console.debug('Skipping API call - user not authenticated');
      return null;
    }

    const cacheKey = `getUserById-${auth0Id}`;
    const cachedRequest = getCachedRequest(cacheKey);
    if (cachedRequest) {
      // console.debug('Returning cached user data for:', auth0Id);
      return cachedRequest;
    }

    const requestPromise = (async () => {
      try {
        const headers = await getAuthHeaders();
        const normalizedId = normalizeAuthId(auth0Id);
        const encodedAuth0Id = encodeURIComponent(normalizedId);
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(encodedAuth0Id)}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.status === 204) return null;
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.json();
      } catch (error) {
        console.error('Error in getUserById:', error);
        throw error;
      }
    })();

    setCachedRequest(cacheKey, requestPromise);
    return requestPromise;
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
    const cacheKey = `checkAndInsertUser-${userId}-${JSON.stringify(userData)}`;
    const cachedRequest = getCachedRequest(cacheKey);
    if (cachedRequest) {
      console.debug('Returning cached insert/update request for:', userId);
      return cachedRequest;
    }

    const requestPromise = (async () => {
      try {
        const headers = await getAuthHeaders();
        const createUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`;
        
        const newUserData = {
          ...userData,
          auth0Id: userId,
          createdAt: new Date().toISOString()
        };

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
    })();

    setCachedRequest(cacheKey, requestPromise);
    return requestPromise;
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
    const cacheKey = `fetchCalendarEvents-${userId}`;
    const cachedRequest = getCachedRequest<CalendarEvent[]>(cacheKey);
    if (cachedRequest) {
      console.debug('Returning cached calendar events for:', userId);
      return cachedRequest;
    }

    const requestPromise = (async () => {
      try {
        const headers = await getAuthHeaders();
        const normalizedId = normalizeAuthId(userId);
        
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_CALENDAR_EVENTS(normalizedId)}`,
          { headers }
        );
        
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const data = await response.json();
        return Array.isArray(data) ? data : data?.events || [];
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        return [];
      }
    })();

    setCachedRequest(cacheKey, requestPromise);
    return requestPromise;
  }, [getAuthHeaders]);

  const createCalendarEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    const cacheKey = `createCalendarEvent-${JSON.stringify(eventData)}`;
    const cachedRequest = getCachedRequest<CalendarEvent>(cacheKey);
    if (cachedRequest) {
      console.debug('Returning cached create event request');
      return cachedRequest;
    }

    const requestPromise = (async () => {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/calendar`,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...eventData, auth0Id: eventData.auth0Id })
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data: CalendarApiResponse = await response.json();
      if (!data.event) throw new Error('No event data returned');
      return data.event;
    })();

    setCachedRequest(cacheKey, requestPromise);
    return requestPromise;
  }, [getAuthHeaders]);

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
  

  
  

