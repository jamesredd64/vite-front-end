import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { fetchCalendarEvents } from '../services/calendarApi';

interface CalendarEvent {
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

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { user } = useAuth0();

  useEffect(() => {
    const loadEvents = async () => {
      if (!user?.sub) return;
      try {
        const fetchedEvents = await fetchCalendarEvents(user.sub);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };

    loadEvents();
  }, [user?.sub]);

  return (
    <CalendarContext.Provider value={{ events, setEvents }}>
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