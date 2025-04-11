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
    credentials: 'include',
    mode: 'cors',
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
  if (!auth0Id) {
    console.error('No auth0Id provided to fetchCalendarEvents');
    return [];
  }

  console.log('Fetching events for auth0Id:', auth0Id);
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/calendar/user/${encodeURIComponent(auth0Id)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched calendar events:', data);
    return data;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};



