export interface CalendarApiResponse {
  success?: boolean;
  events?: CalendarEvent[];
  event?: CalendarEvent;
  message?: string;
}

export interface CalendarEvent {
  id?: string;
  title: string;
  start: string;
  end: string;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  auth0Id: string;
  extendedProps: {
    calendar: 'primary' | 'success' | 'danger' | 'warning';
    description?: string;
    location?: string;
  };
}

