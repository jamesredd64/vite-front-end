import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { CalendarEvent, CalendarApiResponse } from '../types/calendar.types';
import { API_CONFIG, getApiUrl } from '../config/api.config';
import '../styles/calendar.css'; // Add this import
import { CalendarContextMenu, useCalendarContextMenu } from '../components/calendar/CalendarContextMenu';
import { AxiosError } from 'axios';

// Add this helper function at the top of your component
// const addDays = (date: Date, days: number) => {
//   const result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// };

type CalendarType = 'primary' | 'success' | 'danger' | 'warning';

const calendarColorMap: Record<CalendarType, string> = {
  primary: 'calendar-event-primary',
  success: 'calendar-event-success',
  danger: 'calendar-event-danger',
  warning: 'calendar-event-warning'
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

const Calendar = () => {
  const { user } = useAuth0();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState<CalendarEvent['extendedProps']['calendar']>("primary");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const {
    state: contextMenuState,
    handleEventRightClick,
    handleDateRightClick,
    closeContextMenu
  } = useCalendarContextMenu();
  const [eventStartTime, setEventStartTime] = useState("00:00");
  const [eventEndTime, setEventEndTime] = useState("23:59");
  const [isAllDay, setIsAllDay] = useState(true);

  const calendarsEvents = {
    Primary: "primary",
    Success: "success",
    Danger: "danger",    // Changed from "Error" to "Danger" to match schema
    Warning: "warning"
  } as const;

  useEffect(() => {
    if (user?.sub) {
      fetchEvents();
    }
  }, [user?.sub]);

  const fetchEvents = async () => {
    if (!user?.sub) return;
    
    setIsLoading(true);
    try {
      const response = await api.get<CalendarApiResponse>(
        API_CONFIG.ENDPOINTS.USER_CALENDAR_EVENTS(user.sub)
      );
      
      let eventsToSet: CalendarEvent[] = [];
      if (Array.isArray(response.data)) {
        // Normalize dates to ISO format
        eventsToSet = response.data.map(event => ({
          ...event,
          start: new Date(event.start).toISOString(),
          end: new Date(event.end).toISOString()
        }));
      } else if (response.data.events) {
        eventsToSet = response.data.events.map(event => ({
          ...event,
          start: new Date(event.start).toISOString(),
          end: new Date(event.end).toISOString()
        }));
      }
      
      console.log('[Calendar] Normalized events:', eventsToSet);
      setEvents(eventsToSet);
    } catch (error) {
      console.error('[Calendar] Error fetching events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    // Format the clicked date to YYYY-MM-DD
    const formattedDate = selectInfo.start.toISOString().split('T')[0];
    
    console.log('[Calendar] Date selected:', {
      selectedDate: selectInfo.start,
      formattedDate
    });

    setEventStartDate(formattedDate);
    setEventEndDate(formattedDate);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    
    // Get the actual dates from the calendar event
    const startDate = new Date(event.start!);
    const endDate = event.end ? new Date(event.end) : startDate;
    
    // For multi-day events, subtract one day from end date for display in form
    // eslint-disable-next-line prefer-const
    let adjustedEndDate = new Date(endDate);
    if (endDate > startDate) {
      adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);
    }
    
    // Format dates to YYYY-MM-DD for the date inputs
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = adjustedEndDate.toISOString().split('T')[0];

    console.log('[Calendar] Event clicked:', {
      id: event.id,
      title: event.title,
      originalStart: event.startStr,
      originalEnd: event.endStr,
      formattedStart: formattedStartDate,
      formattedEnd: formattedEndDate
    });
    
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: formattedStartDate,
      end: formattedEndDate,
      allDay: event.allDay,
      auth0Id: user?.sub || '',
      extendedProps: {
        calendar: event.extendedProps.calendar,
        description: event.extendedProps.description || '',
        location: event.extendedProps.location || ''
      }
    });
    
    setEventTitle(event.title);
    setEventStartDate(formattedStartDate);
    setEventEndDate(formattedEndDate);
    setEventLevel(event.extendedProps.calendar);
    setIsAllDay(event.allDay);
    openModal();
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    // Parse the date components
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Create a local date first
    const localDate = new Date(year, month - 1, day, hours, minutes);
    
    // Adjust for timezone offset to ensure the date stays the same
    const tzOffset = localDate.getTimezoneOffset();
    localDate.setMinutes(localDate.getMinutes() + tzOffset);
    
    return localDate.toISOString();
  };

  const handleAddOrUpdateEvent = async () => {
    if (!user?.sub) {
      console.warn('[Calendar] No user ID available for event save');
      toast.error('Please log in to manage events');
      return;
    }

    if (!eventTitle || !eventStartDate || !eventLevel) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Only adjust end date for multi-day events
    const endDateToUse = eventEndDate || eventStartDate;
    const eventData: Partial<CalendarEvent> = {
      id: selectedEvent?.id,
      title: eventTitle,
      start: formatDateTime(eventStartDate, isAllDay ? "00:00" : eventStartTime),
      end: formatDateTime(endDateToUse, isAllDay ? "23:59" : eventEndTime),
      allDay: isAllDay,
      auth0Id: user.sub,
      extendedProps: {
        calendar: eventLevel,
        description: '',
        location: ''
      }
    };

    console.log('[Calendar] Saving event with dates:', {
      inputStartDate: eventStartDate,
      inputEndDate: eventEndDate,
      formattedStart: eventData.start,
      formattedEnd: eventData.end,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    try {
      if (selectedEvent?.id) {
        const response = await api.patch<CalendarApiResponse>(
          `/api/calendar/${selectedEvent.id}`, 
          eventData
        );
        
        if (response.data.success && response.data.event) {
          const updatedEvent = {
            ...response.data.event,
            start: new Date(response.data.event.start).toISOString(),
            end: new Date(response.data.event.end).toISOString()
          };
          
          setEvents(prevEvents =>
            prevEvents.map(event =>
              event.id === selectedEvent.id
                ? updatedEvent
                : event
            )
          );
          toast.success('Event updated successfully');
        }
      } else {
        const response = await api.post<CalendarApiResponse>('/api/calendar', eventData);
        
        if (response.data.success && response.data.event) {
          const newEvent = {
            ...response.data.event,
            start: new Date(response.data.event.start).toISOString(),
            end: new Date(response.data.event.end).toISOString()
          };
          
          setEvents(prevEvents => [...prevEvents, newEvent]);
          toast.success('Event added successfully');
        }
      }
      closeModal();
      resetModalFields();
    } catch (error) {
      console.error('[Calendar] Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await api.delete<CalendarApiResponse>(`/api/calendar/${eventId}`);
      if (response.data.success) {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        closeModal();
        toast.success('Event deleted successfully');
        await refreshCalendar(); // Refresh after delete
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventStartTime("00:00");
    setEventEndTime("23:59");
    setIsAllDay(true);
    setEventLevel("primary"); // Set default color to match backend enum
    setSelectedEvent(null);
  };

  const handleContextMenuDelete = async () => {
    if (contextMenuState.contextMenuEventId) {
      try {
        const response = await api.delete<CalendarApiResponse>(`/api/calendar/${contextMenuState.contextMenuEventId}`);
        
        if (response.data.success) {
          setEvents(prevEvents => prevEvents.filter(event => event.id !== contextMenuState.contextMenuEventId));
          closeContextMenu();
          toast.success('Event deleted successfully');
          await refreshCalendar();
        }
      } catch (error) {
        console.error('[Calendar] Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  const handleContextMenuAdd = () => {
    if (contextMenuState.selectedDate) {
      resetModalFields();
      setEventStartDate(contextMenuState.selectedDate);
      setEventEndDate(contextMenuState.selectedDate);
      setEventLevel('primary');
      closeContextMenu();
      openModal();
    }
  };

  // Add a refresh function that can be called from anywhere
  const refreshCalendar = async () => {
    if (!user?.sub) {
      console.log('[Calendar] No user ID available for refresh');
      return;
    }
    
    console.group('[Calendar] Refreshing Calendar');
    console.log('Refreshing events for user:', user.sub);
    setIsLoading(true);
    
    try {
      const response = await api.get<CalendarApiResponse>(
        API_CONFIG.ENDPOINTS.USER_CALENDAR_EVENTS(user.sub)
      );
      
      console.log('[Calendar] Refresh response:', {
        status: response.status,
        data: response.data
      });

      if (Array.isArray(response.data)) {
        console.log('[Calendar] Setting events array:', response.data.length, 'events');
        setEvents(response.data);
      } else if (response.data.events) {
        console.log('[Calendar] Setting events from response.data.events:', response.data.events.length, 'events');
        setEvents(response.data.events);
      } else {
        console.log('[Calendar] No events found, setting empty array');
        setEvents([]);
      }

      if (calendarRef.current) {
        console.log('[Calendar] Triggering FullCalendar refetch');
        calendarRef.current.getApi().refetchEvents();
      }
    } catch (error) {
      console.error('[Calendar] Error during refresh:', error);
      if (error instanceof Error && 'response' in error && error.response) {
        console.error('[Calendar] Error Response:', {
          status: (error as AxiosError)?.response?.status,
          data: (error as AxiosError).response?.data || {}
        });
      }
      toast.error('Failed to refresh calendar');
      setEvents([]);
    } finally {
      setIsLoading(false);
      console.log('[Calendar] Refresh operation completed');
      console.groupEnd();
    }
  };

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <>
      <PageMeta title="Calendar" description="Manage your events and schedules" />
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Calendar
          </h2>
        </div>

        <div 
          className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
          onContextMenu={(e) => e.preventDefault()} // Move context menu prevention to container
        >
          {(() => {
            console.log('[Calendar] Rendering with events:', events);
            return null;
          })()}
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <p>No events found</p>
            </div>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={events}
              initialView="dayGridMonth"
              selectable={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventDidMount={(info) => {
                const eventEl = info.el;
                eventEl.addEventListener('contextmenu', (e) => {
                  e.preventDefault();
                  handleEventRightClick({
                    jsEvent: e,
                    event: {
                      id: info.event.id,
                      title: info.event.title,
                      extendedProps: {
                        calendar: info.event.extendedProps.calendar as string
                      }
                    }
                  });
                });
              }}
              dateClick={(info) => {
                if (info.jsEvent.type === 'contextmenu') {
                  handleDateRightClick({
                    dateStr: info.dateStr,
                    jsEvent: info.jsEvent as MouseEvent
                  });
                }
              }}
              eventClassNames={(info) => {
                const calendarType = info.event.extendedProps.calendar?.toLowerCase() || 'primary';
                return [
                  'calendar-event',
                  calendarColorMap[calendarType as keyof typeof calendarColorMap],
                  `bg-${calendarType}`
                ];
              }}
              eventContent={(info) => {
                return (
                  <div className="fc-event-main-frame">
                    <div className="fc-event-title-container">
                      <div className="fc-event-title">{info.event.title}</div>
                    </div>
                  </div>
                );
              }}
            />
          )}
        </div>

        {/* Context Menu */}
        {contextMenuState.showContextMenu && (
          <CalendarContextMenu
            x={contextMenuState.contextMenuPosition.x}
            y={contextMenuState.contextMenuPosition.y}
            onDelete={handleContextMenuDelete}
            onAdd={handleContextMenuAdd}
            onClose={closeContextMenu}
            mode={contextMenuState.contextMenuMode}
          />
        )}

        {/* Event Modal */}
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div className="mt-6">
                <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Color
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {Object.entries(calendarsEvents).map(([key, value]) => (
                    <div key={key} className="n-chk">
                      <div className={`form-check form-check-${value}`}>
                        <label
                          className="flex items-center text-sm text-gray-700 cursor-pointer form-check-label dark:text-gray-400"
                          htmlFor={`modal${key}`}
                        >
                          <span className="relative">
                            <input
                              className="sr-only form-check-input"
                              type="radio"
                              name="event-level"
                              value={value}
                              id={`modal${key}`}
                              checked={eventLevel === value}
                              onChange={(e) => {
                                setEventLevel(e.target.value as typeof eventLevel);
                              }}
                            />
                            <span 
                              className={`flex items-center justify-center w-5 h-5 mr-2 border rounded-full transition-colors duration-150
                                ${eventLevel === value 
                                  ? `bg-${value} border-${value}` 
                                  : 'border-gray-300 dark:border-gray-700'}`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full bg-white 
                                  ${eventLevel === value ? 'block' : 'hidden'}`}
                              />
                            </span>
                          </span>
                          {key}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="allDay" className="text-sm text-gray-700 dark:text-gray-400">
                  All Day Event
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={eventStartDate.split('T')[0]}
                      onChange={(e) => setEventStartDate(e.target.value)}
                      className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>

                {!isAllDay && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Start Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={eventStartTime}
                        onChange={(e) => setEventStartTime(e.target.value)}
                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={eventEndDate.split('T')[0]}
                      onChange={(e) => setEventEndDate(e.target.value)}
                      className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>

                {!isAllDay && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      End Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={eventEndTime}
                        onChange={(e) => setEventEndTime(e.target.value)}
                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              {selectedEvent && (
                <button
                  onClick={() => selectedEvent.id && handleDeleteEvent(selectedEvent.id)}
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600"
                >
                  Delete
                </button>
              )}
              <button
                onClick={closeModal}
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                Close
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                {selectedEvent ? "Update Changes" : "Add Event"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Calendar;

