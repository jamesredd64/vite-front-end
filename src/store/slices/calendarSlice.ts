import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent } from '../../types/calendar.types';

interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: CalendarState = {
  events: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCalendarEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
      state.events = action.payload;
      state.lastFetched = Date.now();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    clearEvents: (state) => {
      state.events = [];
      state.lastFetched = null;
    },
  },
});

export const {
  setCalendarEvents,
  setLoading,
  setError,
  addEvent,
  updateEvent,
  deleteEvent,
  clearEvents,
} = calendarSlice.actions;

export default calendarSlice.reducer;