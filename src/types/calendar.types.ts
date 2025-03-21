export interface CalendarEvent {
  id?: string;  title: string;
  start: string;  end: string;
  allDay: boolean;  extendedProps: {
    calendar: string;    description?: string;
    location?: string;  };
}
export interface CalendarApiResponse {  success: boolean;
  events?: CalendarEvent[];  event?: CalendarEvent;
  message?: string;
}










