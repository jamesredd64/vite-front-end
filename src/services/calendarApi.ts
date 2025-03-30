import { API_CONFIG } from '../config/api.config';

interface CalendarEvent {
  title: string;
  start: Date | string;
  end: Date | string;
  description?: string;
  auth0Id: string;
  color?: string;
  allDay?: boolean;
}

export const createCalendarEvent = async (eventData: CalendarEvent) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/calendar/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error('Failed to create event');
  }

  return response.json();
};

export const updateCalendarEvent = async (eventId: string, eventData: CalendarEvent) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/calendar/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error('Failed to update event');
  }

  return response.json();
};

export const fetchCalendarEvents = async (auth0Id: string) => {
  console.log('Fetching events for auth0Id:', auth0Id);
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/calendar/events/${auth0Id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched events from api:', data);
    
    // Ensure we return the events array, whether it's in data.events or data directly
    const events = data.events || data;
    return Array.isArray(events) ? events : [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error; // Let the caller handle the error
  }
};



