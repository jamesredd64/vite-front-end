import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import ChevronLeftIcon from '../icons/chevron-left.svg?react';
import ChevronRightIcon from '../icons/chevron-right.svg?react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CalendarEvent, CalendarApiResponse } from '../types/calendar.types';
interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuProps {
  x: number;
  y: number;
  onDelete?: () => void;
  onAdd?: () => void;
  onClose: () => void;
  mode: 'event' | 'grid';
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onDelete, onAdd, onClose, mode }) => {
  return (
    <div 
      className="fixed bg-white shadow-lg rounded-md py-2 z-50 context-menu"
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        minWidth: '150px'
      }}
    >
      {mode === 'event' && (
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          Delete Event
        </button>
      )}
      {mode === 'grid' && (
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onAdd?.();
          }}
        >
          Add Event
        </button>
      )}
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        Close
      </button>
    </div>
  );
};

export const Calendar = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const [contextMenuEventId, setContextMenuEventId] = useState<string | null>(null);
  const [contextMenuMode, setContextMenuMode] = useState<'event' | 'grid'>('event');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const calendarsEvents = {
    Primary: "primary",
    Success: "success",
    Error: "error",    // Changed from "Danger" to match the CSS classes
    Warning: "warning"
  } as const;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<CalendarApiResponse>('/calendar');
      if (response.data.success && response.data.events) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr || event.startStr,
      allDay: event.allDay,
      extendedProps: {
        calendar: event.extendedProps.calendar,
        description: event.extendedProps.description || '',
        location: event.extendedProps.location || ''
      }
    });
    setEventTitle(event.title);
    setEventStartDate(event.startStr);
    setEventEndDate(event.endStr || event.startStr);
    setEventLevel(event.extendedProps.calendar); // This should now correctly set the color
    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    if (!eventTitle || !eventStartDate || !eventLevel) {
      toast.error('Please fill in all required fields');
      return;
    }

    const eventData: Partial<CalendarEvent> = {
      title: eventTitle,
      start: eventStartDate,
      end: eventEndDate || eventStartDate,
      allDay: true,
      extendedProps: {
        calendar: eventLevel.toLowerCase(), // Ensure we're sending lowercase value
        description: '',
        location: ''
      }
    };

    try {
      if (selectedEvent?.id) {
        const response = await api.patch<CalendarApiResponse>(`/calendar/${selectedEvent.id}`, eventData);
        if (response.data.success) {
          setEvents(prevEvents =>
            prevEvents.map(event =>
              event.id === selectedEvent.id
                ? {
                    ...event,
                    title: eventData.title!,
                    start: eventData.start!,
                    end: eventData.end!,
                    allDay: eventData.allDay!,
                    extendedProps: {
                      calendar: eventData.extendedProps!.calendar!,
                      description: eventData.extendedProps?.description || '',
                      location: eventData.extendedProps?.location || ''
                    }
                  }
                : event
            )
          );
          toast.success('Event updated successfully');
        }
      } else {
        const response = await api.post<CalendarApiResponse>('/calendar', eventData);
        if (response.data.success && response.data.event) {
          setEvents(prevEvents => [...prevEvents, response.data.event!]);
          toast.success('Event added successfully');
        }
      }
      closeModal();
      resetModalFields();
      await refreshCalendar();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await api.delete<CalendarApiResponse>(`/calendar/${eventId}`);
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
    setEventLevel("primary"); // Set default color to match backend enum
    setSelectedEvent(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking the context menu itself
      if (event.target instanceof Element && 
          !event.target.closest('.context-menu')) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showContextMenu]);

  const handleEventRightClick = (info: any) => {
    info.jsEvent.preventDefault();
    const event = info.event;
    
    console.log('[Calendar] Right click event:', {
      id: event.id,
      title: event.title
    });
    
    setContextMenuEventId(event.id);
    setContextMenuMode('event');
    setContextMenuPosition({
      x: info.jsEvent.clientX,
      y: info.jsEvent.clientY,
    });
    setShowContextMenu(true);
  };

  const handleContextMenuDelete = async () => {
    if (contextMenuEventId) {
      try {
        const response = await api.delete<CalendarApiResponse>(`/calendar/${contextMenuEventId}`);
        
        if (response.data.success) {
          setEvents(prevEvents => prevEvents.filter(event => event.id !== contextMenuEventId));
          setShowContextMenu(false);
          toast.success('Event deleted successfully');
          await refreshCalendar();
        }
      } catch (error) {
        console.error('[Calendar] Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  const handleDateRightClick = (info: { dateStr: string; jsEvent: MouseEvent }) => {
    info.jsEvent.preventDefault();
    console.log('[Calendar] Right click on date:', info.dateStr);
    
    setSelectedDate(info.dateStr);
    setContextMenuMode('grid');
    setContextMenuPosition({
      x: info.jsEvent.clientX,
      y: info.jsEvent.clientY,
    });
    setShowContextMenu(true);
  };

  const handleContextMenuAdd = () => {
    if (selectedDate) {
      resetModalFields();
      setEventStartDate(selectedDate);
      setEventEndDate(selectedDate);
      setEventLevel('Primary'); // Set a default calendar type
      setShowContextMenu(false);
      openModal();
    }
  };

  // Add a refresh function that can be called from anywhere
  const refreshCalendar = async () => {
    console.log('[Calendar] Starting calendar refresh');
    setIsLoading(true);
    
    try {
      console.log('[Calendar] Fetching updated events');
      const response = await api.get<CalendarApiResponse>('/calendar');
      
      console.log('[Calendar] Refresh response:', {
        success: response.data.success,
        eventCount: response.data.events?.length
      });

      if (response.data.success && response.data.events) {
        console.log('[Calendar] Updating events state');
        setEvents(response.data.events);
        
        if (calendarRef.current) {
          console.log('[Calendar] Triggering FullCalendar refetch');
          calendarRef.current.getApi().refetchEvents();
        } else {
          console.warn('[Calendar] Calendar ref not available during refresh');
        }
      }
    } catch (error) {
      console.error('[Calendar] Error during refresh:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        fullError: error
      });
      toast.error('Failed to refresh calendar');
    } finally {
      setIsLoading(false);
      console.log('[Calendar] Refresh operation completed');
    }
  };

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <>
      <PageMeta title="Calendar" description={""} />
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
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDidMount={(info) => {
              const eventEl = info.el;
              eventEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleEventRightClick({
                  jsEvent: e,
                  event: info.event
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
            initialView="dayGridMonth"
            editable={true}
            eventClassNames={(info) => {
              const calendar = info.event.extendedProps.calendar?.toLowerCase();
              return [`bg-${calendar}-500`, `border-${calendar}-500`];
            }}
          />
        </div>

        {/* Context Menu */}
        {showContextMenu && (
          <ContextMenu
            x={contextMenuPosition.x}
            y={contextMenuPosition.y}
            onDelete={contextMenuMode === 'event' ? handleContextMenuDelete : undefined}
            onAdd={contextMenuMode === 'grid' ? handleContextMenuAdd : undefined}
            onClose={() => setShowContextMenu(false)}
            mode={contextMenuMode}
          />
        )}

        {/* Event Modal */}
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedEvent ? "Edit Event" : "Add Event"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Plan your next big moment: schedule or edit an event to stay on track
              </p>
            </div>
            <div className="mt-8">
              <div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Event Title
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Color
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {Object.entries(calendarsEvents).map(([key, value]) => (
                    <div key={key} className="n-chk">
                      <div className={`form-check form-check-${value.toLowerCase()}`}>
                        <label
                          className="flex items-center text-sm text-gray-700 cursor-pointer form-check-label dark:text-gray-400"
                          htmlFor={`modal${key}`}
                        >
                          <span className="relative">
                            <input
                              className="sr-only form-check-input"
                              type="radio"
                              name="event-level"
                              value={value.toLowerCase()}
                              id={`modal${key}`}
                              checked={eventLevel === value.toLowerCase()}
                              onChange={(e) => setEventLevel(e.target.value)}
                            />
                            <span 
                              className={`flex items-center justify-center w-5 h-5 mr-2 border rounded-full transition-colors duration-150
                                ${eventLevel === value.toLowerCase() 
                                  ? `bg-${value.toLowerCase()}-500 border-${value.toLowerCase()}-500` 
                                  : 'border-gray-300 dark:border-gray-700'}`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full bg-white 
                                  ${eventLevel === value.toLowerCase() ? 'block' : 'hidden'}`}
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

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter Start Date
                </label>
                <div className="relative">
                  <input
                    id="event-start-date"
                    type="date"
                    value={eventStartDate.split('T')[0]}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter End Date
                </label>
                <div className="relative">
                  <input
                    id="event-end-date"
                    type="date"
                    value={eventEndDate.split('T')[0]}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
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


