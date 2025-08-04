/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useRef, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import  UserMetadata  from '../types/user';
import { API_CONFIG } from '../config/api.config';
import { CalendarEvent, CalendarApiResponse } from '../types/calendar.types';
// import axios from 'axios';

// const MAX_RETRIES = 2;
// const RETRY_DELAY = 1000;
const TIMEOUT = 5000; // 5 seconds timeout

interface ApiError {
  message: string;
  status?: number;
}

interface ErrorResponse {
  message: string;
  status?: number; // Optional, if you want to include an HTTP status code
}

type UserData = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profile?: {
    dateOfBirth?: string | null;
    gender?: string;
    profilePictureUrl?: string;
    role?: string;
    timezone?: string;
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
  isActive: boolean;
};

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

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://dev-rq8rokyotwtjem12.us.auth0.com/api/v2/',
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

  const createHeaders = async () => ({
    ...(await getAuthHeaders()),
    'Content-Type': 'application/json',
  });

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


  const getUserById = useCallback(async (auth0Id: string) => {
    if (!isAuthenticated) {
      console.log('getUserById: Not authenticated, returning null');
      return null;
    }

    setLoading(true);
    console.log('getUserById: Fetching user data for:', auth0Id);

    try {
      const headers = await getAuthHeaders();
      const normalizedId = normalizeAuthId(auth0Id);
      const encodedAuth0Id = encodeURIComponent(normalizedId);
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(encodedAuth0Id)}`;
      
      console.log('getUserById: Making request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      console.log('getUserById: Response status:', response.status);

      if (response.status === 204) {
        console.log('getUserById: No content found');
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('getUserById: Received data:', data);
      return data;
    } catch (error) {
      console.error('getUserById: Error:', error);
      setError({
        message: error instanceof Error ? error.message : 'Failed to fetch user data',
        status: error instanceof Response ? error.status : undefined
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAuthHeaders]);


  const getAllUsers = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("getAllUsers: Not authenticated, returning null");
      return null;
    }
  
    setLoading(true);
    console.log("getAllUsers: Fetching all users...");
  
    try {
      const headers = await getAuthHeaders();
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_USERS}`;
  
      console.log("getAllUsers: Making request to:", url);
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      console.log("getAllUsers: Response status:", response.status);
  
      if (response.status === 204) {
        console.log("getAllUsers: No users found");
        return [];
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("getAllUsers: Received user list:", data);
      return data;
    } catch (error) {
      console.error("getAllUsers: Error:", error);
      setError({
        message: error instanceof Error ? error.message : "Failed to fetch users",
        status: error instanceof Response ? error.status : undefined,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAuthHeaders]);

  
  const checkAndInsertUser = useCallback(async (userId: string, userData: UserData) => {
    const cacheKey = `checkAndInsertUser-${userId}`;
    const cachedRequest = getCachedRequest(cacheKey);
    if (cachedRequest) {
      console.debug("Returning cached insert/update request for:", userId);
      return cachedRequest;
    }
  
    const requestPromise = (async () => {
      try {
        const headers = await createHeaders();
        const userUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/${userId}`;
        const createUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`;
  
        // 🔹 Step 1: Check if user already exists
        const checkResponse = await fetch(userUrl, { method: "GET", headers });
  
        if (checkResponse.ok) {
          console.debug(`User ${userId} already exists in the database.`);
          return await checkResponse.json(); // Return existing user data
        }
  
        // 🔹 Step 2: If user does NOT exist, create a new user
        const newUserData = {
          ...userData,
          auth0Id: userId,
          createdAt: new Date().toISOString(),
        };
  
        console.log("Creating new user:", newUserData);
  
        const createResponse = await fetch(createUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(newUserData),
        });
  
        if (!createResponse.ok) {
          throw new Error(`Failed to create user. Status: ${createResponse.status}`);
        }
  
        return await createResponse.json();
      } catch (error) {
        console.error("Error in checkAndInsertUser:", error);
        throw error;
      }
    })();
  
    setCachedRequest(cacheKey, requestPromise);
    return requestPromise;
  }, []);

  
  // const checkAndInsertUser = useCallback(async (userId: string, userData: UserData) => {
  //   const cacheKey = `checkAndInsertUser-${userId}`;
  //   const cachedRequest = getCachedRequest(cacheKey);
  //   if (cachedRequest) {
  //     console.debug('Returning cached insert/update request for:', userId);
  //     return cachedRequest;
  //   }
  
  //   const requestPromise = (async () => {
  //     try {
  //       const headers = await createHeaders();
  //       const createUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`;
  
  //       const newUserData = {
  //         ...userData,
  //         auth0Id: userId,
  //         createdAt: new Date().toISOString(),
  //       };
  
  //       console.log("newUserData ", newUserData);
        
  //       const createResponse = await fetch(createUrl, {
  //         method: 'POST',
  //         headers,
  //         body: JSON.stringify(newUserData),
  //       });

  //       if (!createResponse.ok) {
  //         throw new Error(`Failed to create user. Status: ${createResponse.status}`);
  //       }
  
  //       return await createResponse.json();
  //     } catch (error) {
  //       console.error('Error in checkAndInsertUser:', error);
  //       throw error;
  //     }
  //   })();
  
  //   setCachedRequest(cacheKey, requestPromise);
  //   return requestPromise;
  // }, []);
  
 
  // Update User
  
  const updateUser = useCallback(async (auth0Id: string, userData: {
    email?: string;
    firstName?: string;
    // lastName?: string;
    // phoneNumber?: string;
    profile?: {
      // dateOfBirth?: string | null;
      // gender?: string;
      profilePictureUrl?: string;
      role?: 'showcase_attendee' | 'showcase_agent' | 'showcase_team' | 'showcase_admin';
      // timezone?: string;
    };
    
    // marketingBudget?: {
    //   adBudget?: number;
    //   costPerAcquisition?: number;
    //   dailySpendingLimit?: number;
    //   marketingChannels?: string;
    //   monthlyBudget?: number;
    //   preferredPlatforms?: string;
    //   notificationPreferences?: string[];
    //   roiTarget?: number;
    //   frequency?: "daily" | "monthly" | "quarterly" | "yearly";
    // };
    // address?: {
    //   street?: string;
    //   city?: string;
    //   state?: string;
    //   zipCode?: string;
    //   country?: string;
    // };
    isActive?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {

       // getUserById

      const existingUser = await getUserById(auth0Id);

      const mergedData = {
        ...userData,
        auth0Id,
        profile: {
          ...existingUser?.profile,
          ...userData.profile,
          role: userData.profile?.role || existingUser?.profile?.role || 'showcase_attendee',
        },
        // marketingBudget: userData.marketingBudget,
        // address: userData.address ,
        isActive: userData.isActive || existingUser?.isActive,
      };
      console.log("IsActive ", userData.isActive);
      console.log("Preparing to update user with data:", mergedData);

      // Check and Insert User

      const updatedUser = await checkAndInsertUser(auth0Id, mergedData);

      return updatedUser;
      
    } catch (error) {
      console.error('Error in updateUser:', error);
      setError({
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: error instanceof Error ? undefined : 500,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [checkAndInsertUser, getUserById]);

  const doesUserExist = async (auth0Id: string) => {
    try {
      const userData = await getUserById(auth0Id); // 🔹 Use the existing function from mongodbClient
      return userData !== null; // If userData is null, the user does not exist
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false; // Assume user doesn't exist if there's an error
    }
  };  

  const saveUserData = async (auth0Id: string, data: Partial<UserMetadata>, section?: "meta" | "address" | "marketing") => {
    try {
      const userExists = await getUserById(auth0Id); // 🔹 Check if user exists first
  
      let method = userExists ? "PUT" : "POST"; // 🔹 Use `POST` if the user doesn't exist
      let endpoint = userExists
        ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SAVE_USER_DATA(auth0Id)}`
        : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`; // Ensure this endpoint properly handles creation
  
      if (section && userExists) {
        endpoint += `?section=${section}`;
      }
  
      const headers = await getAuthHeaders();
      const response = await fetch(endpoint, {
        method,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("Saving users...", data);
      if (!response.ok) {
        throw new Error(`Failed to ${method === "POST" ? "create" : "update"} user. Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in saveUserData:", error);
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

  // Get Users Role
  // services/userService.ts
 const getUsersRole = useCallback(async (auth0Id: string) => {
  if (!isAuthenticated) {
    console.log('getUserById: Not authenticated, returning null');
    return null;
  }

  if (requestInProgress) {
    console.warn("Request is already in progress.");
    return null;
  }

  setLoading(true);
    console.log('getUsersRole: Fetching user profilefor:', auth0Id);
  try {
      const headers = await getAuthHeaders();    
      const normalizedId = normalizeAuthId(auth0Id);
      const encodedAuth0Id = encodeURIComponent(normalizedId);
      console.log("Fetching user data for ID:", auth0Id);

    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(auth0Id)}`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("MongoDB Response:", data);

    return data; // Successfully retrieved data
  } catch (error) {
    console.error("Error fetching user data:", error);
    setError({
      message: error instanceof Error ? error.message : "Failed to fetch user data",
      status: error instanceof Response ? error.status : undefined,
    });

    return null;
  } finally {
    setLoading(false);
    // requestInProgress = false;
  }
}, [isAuthenticated, getAuthHeaders]);


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

  const getAllScheduledEvents = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("getAllScheduledEvents: Not authenticated, returning null");
      return null;
    }
  
    setLoading(true);
    console.log("getAllScheduledEvents: Fetching all scheduled events...");
  
    try {
      const headers = await getAuthHeaders();
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCHEDULED_EVENTS}`;
  
      console.log("getAllScheduledEvents: Making request to:", url);
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: 'cors',
      });
  
      console.log("getAllScheduledEvents: Response status:", response.status);
  
      if (response.status === 204) {
        console.log("getAllScheduledEvents: No events found");
        return [];
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const events = await response.json();
      console.log("getAllScheduledEvents: Received event list:", events);
      return events;
    } catch (error) {
      console.error("getAllScheduledEvents: Error:", error);
      setError({
        message: error instanceof Error ? error.message : "Failed to fetch scheduled events",
        status: error instanceof Response ? error.status : undefined,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAuthHeaders]);
  

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
    getUsersRole,
    fetchCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    getAllUsers,
    getAllScheduledEvents
  };
}; 
  

// const saveUserData = async (auth0Id: string, data: Partial<UserMetadata>, section?: 'meta' | 'address' | 'marketing') => {
  //   try {
  //     let endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SAVE_USER_DATA(auth0Id)}`;
  //     if (section) {
  //       endpoint += `?section=${section}`;
  //     }

  //     const headers = await getAuthHeaders();
  //     const response = await fetch(endpoint, {
  //       method: 'PUT',
  //       headers: {
  //         ...headers,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data)
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to save user data. Status: ${response.status}`);
  //     }

  //     const serverResponse = await response.json();
  //     return serverResponse;
  //   } catch (error) {
  //     console.error('Error in saveUserData:', error);
  //     throw error;
  //   }
  // };
  
