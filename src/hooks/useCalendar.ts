import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  setCalendarEvents, 
  addEvent, 
  updateEvent, 
  deleteEvent,
  setLoading,
  setError 
} from '../store/slices/calendarSlice';
import { fetchCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../services/calendarApi';
import { CalendarEvent } from '../types/calendar.types';

export const useCalendar = () => {
  const dispatch = useDispatch();
  const { events, isLoading, error, lastFetched } = useSelector((state: RootState) => state.calendar);

  const refreshEvents = async (userId: string) => {
    try {
      dispatch(setLoading(true));
      const fetchedEvents = await fetchCalendarEvents(userId);
      dispatch(setCalendarEvents(fetchedEvents));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to refresh events'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createEvent = async (eventData: CalendarEvent) => {
    try {
      dispatch(setLoading(true));
      const newEvent = await createCalendarEvent(eventData);
      dispatch(addEvent(newEvent));
      return newEvent;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create event'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateEventById = async (eventId: string, eventData: CalendarEvent) => {
    try {
      dispatch(setLoading(true));
      const updatedEvent = await updateCalendarEvent(eventId, eventData);
      dispatch(updateEvent(updatedEvent));
      return updatedEvent;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update event'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteEventById = async (eventId: string) => {
    try {
      dispatch(setLoading(true));
      await deleteCalendarEvent(eventId);
      dispatch(deleteEvent(eventId));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to delete event'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    events,
    isLoading,
    error,
    lastFetched,
    refreshEvents,
    createEvent,
    updateEventById,
    deleteEventById,
  };
};