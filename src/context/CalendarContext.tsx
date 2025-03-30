import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { fetchCalendarEvents } from '../services/calendarApi';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  extendedProps: {
    calendar: string;
    description?: string;
  };
}

interface CalendarContextType {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { user } = useAuth0();

  useEffect(() => {
    const loadEvents = async () => {
      if (!user?.sub) return;
      
      try {
        console.log('Fetching events for user:', user.sub);
        const fetchedEvents = await fetchCalendarEvents(user.sub);
        console.log('Received events:', fetchedEvents);
        
        if (Array.isArray(fetchedEvents)) {
          setEvents(fetchedEvents);
        } else {
          console.warn('Received non-array events:', fetchedEvents);
          setEvents([]);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
        setEvents([]);
      }
    };

    loadEvents();
  }, [user?.sub]);

  const contextValue = useMemo(() => ({
    events,
    setEvents
  }), [events]);

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
