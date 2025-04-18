import { API_CONFIG } from '../config/api.config';

interface CalendarEvent {
  id?: string;
  title: string;
  start: Date | string;
  end: Date | string;
  description?: string;
  auth0Id: string;
  color?: string;
  allDay?: boolean;
  extendedProps?: {
    calendar?: 'primary' | 'success' | 'danger' | 'warning';
    description?: string;
    location?: string;
  };
}

const isDuplicateEvent = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  const isSameTitle = event1.title === event2.title;
  const isSameStart = new Date(event1.start).getTime() === new Date(event2.start).getTime();
  const isSameUser = event1.auth0Id === event2.auth0Id;
  
  return isSameTitle && isSameStart && isSameUser;
};

export const createCalendarEvent = async (eventData: CalendarEvent) => {
  // First fetch existing events to check for duplicates
  const existingEvents = await fetchCalendarEvents(eventData.auth0Id);
  
  const duplicate = existingEvents.find(event => isDuplicateEvent(event, eventData));
  if (duplicate) {
    throw new Error('An event with the same title and start time already exists');
  }

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
  // Fetch existing events to check for duplicates
  const existingEvents = await fetchCalendarEvents(eventData.auth0Id);
  
  const duplicate = existingEvents.find(event => 
    event.id !== eventId && // Exclude the current event being updated
    isDuplicateEvent(event, eventData)
  );
  
  if (duplicate) {
    throw new Error('Update would create a duplicate event');
  }

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

    // Deduplicate events
    const events = Array.isArray(data) ? data : [];
    const uniqueEvents = events.reduce<CalendarEvent[]>((acc, current) => {
      const isDuplicate = acc.some(event => isDuplicateEvent(event, current));
      
      if (!isDuplicate) {
        acc.push(current);
      } else {
        console.debug('Filtered out duplicate event:', current);
      }
      
      return acc;
    }, []);

    return uniqueEvents;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};

export const deleteCalendarEvent = async (eventId: string) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/calendar/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    mode: 'cors'
  });

  if (!response.ok) {
    throw new Error('Failed to delete event');
  }

  return response.json();
};

