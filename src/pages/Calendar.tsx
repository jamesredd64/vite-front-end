import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
// import ChevronLeftIcon from '../icons/chevron-left.svg?react';
// import ChevronRightIcon from '../icons/chevron-right.svg?react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMongoDbClient } from "../services/mongoDbClient";
import Toast from "../components/ui/Toast";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const { user } = useAuth0();
  const { fetchCalendarEvents, createCalendarEvent, updateCalendarEvent } = useMongoDbClient();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [showToast, setShowToast] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  useEffect(() => {
    const loadEvents = async () => {
      console.log('Starting loadEvents function');
      if (!user?.sub) {
        console.log('No user ID available');
        return;
      }
      console.log('Loading events for user:', user.sub);

      try {
        console.log('Fetching calendar events...');
        const fetchedEvents = await fetchCalendarEvents(user.sub);
        console.log('Successfully fetched events:', fetchedEvents.length);
        console.log('Event data:', fetchedEvents);
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Failed to fetch calendar events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      }
    };

    loadEvents();
  }, [user?.sub, fetchCalendarEvents]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    const startDate = selectInfo.startStr;
    setEventStartDate(startDate);
    console.log("Just clicked event to edit and start date =:", startDate);
    // Set end date to the next day for new events
    const endDate = new Date(selectInfo.startStr);
    endDate.setDate(endDate.getDate() + 1);
    console.log("Just clicked event to edit and end date = :", endDate.getDate() + 1 );
    setEventEndDate(endDate.toISOString().split('T')[0]);
    
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    console.log('Clicked event data:', event); // Add logging to see full event data
    
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    
    // Handle start date
    const startDate = event.start ? event.start.toISOString().split('T')[0] : event.startStr.split('T')[0];
    setEventStartDate(startDate);
    console.log('startDate: ', startDate); // Add logging to see full event data
    // Handle end date
    const endDate = event.end ? event.end.toISOString().split('T')[0] : event.endStr.split('T')[0];
    setEventEndDate(endDate);
    console.log('endDate: ', endDate); // Add logging to see full event data
    
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    console.log('Starting handleAddOrUpdateEvent');
    console.log('Current form values:', {
      eventTitle,
      eventStartDate,
      eventEndDate,
      eventLevel,
      selectedEvent: selectedEvent ? selectedEvent.id : 'none'
    });

    if (!user?.sub) {
      console.error('No user ID available');
      return;
    }

    try {
      const createEventData = (date: string) => {
        const utcDate = new Date(Date.UTC(
          new Date(date).getUTCFullYear(),
          new Date(date).getUTCMonth(),
          new Date(date).getUTCDate(),
          0, 0, 0, 0
        ));
        console.log(`Converting start date ${date} to UTC:`, utcDate.toISOString());
        return utcDate.toISOString();
      };

      const createEndDate = (date: string) => {
        const utcDate = new Date(Date.UTC(
          new Date(date).getUTCFullYear(),
          new Date(date).getUTCMonth(),
          new Date(date).getUTCDate(),
          23, 59, 59, 999
        ));
        console.log(`Converting end date ${date} to UTC:`, utcDate.toISOString());
        return utcDate.toISOString();
      };

      if (selectedEvent) {
        console.log('Updating existing event:', selectedEvent.id);
        const updatedEventData = {
          title: eventTitle,
          start: createEventData(eventStartDate),
          end: createEndDate(eventEndDate),
          allDay: true,
          auth0Id: user.sub,
          extendedProps: { 
            calendar: eventLevel as 'primary' | 'success' | 'danger' | 'warning'
          }
        };
        console.log('Updated event data:', updatedEventData);

        if (!selectedEvent.id) {
          throw new Error('Event ID is missing');
        }
        await updateCalendarEvent(selectedEvent.id, updatedEventData);
        console.log('Event updated successfully');

        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id
              ? {
                  ...event,
                  ...updatedEventData
                }
              : event
          )
        );
      } else {
        console.log('Creating new event');
        const newEventData = {
          title: eventTitle,
          start: createEventData(eventStartDate),
          end: createEndDate(eventEndDate),
          allDay: true,
          auth0Id: user.sub,
          extendedProps: {
            calendar: eventLevel as 'primary' | 'success' | 'danger' | 'warning'
          }
        };
        console.log('New event data:', newEventData);

        const savedEvent = await createCalendarEvent(newEventData);
        console.log('Event created successfully:', savedEvent);

        setEvents((prevEvents) => [...prevEvents, {
          ...newEventData,
          id: savedEvent.id
        }]);
      }

      console.log('Closing modal and resetting fields');
      closeModal();
      resetModalFields();
    } catch (error) {
      console.error('Failed to save event:', error);
      setError(error instanceof Error ? error.message : 'Failed to save event');
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <Toast 
        message="Please click on a date to add an event!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)}
        type="info"
        position="center" // This will center the toast both vertically and horizontally
      />
      {error && (
        <div className="p-2 mb-4 rounded-lg bg-error-50 p-4 text-error-500">
          <p>{error}</p>
        </div>
      )}
      <div className="p-2 md:p-6 2xl:p-3">
        <div className="mx-auto max-w-full">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            // titleFormat={{ // Add this prop
            //   month: 'long yyyy', // Will display as "September 2023"
            //   // Alternative formats:
            //   // month: 'short yyyy' // Will display as "Sep 2023"
            //   // month: "MMM yyyy" // Will display as "Sep 2023"
            // }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={{
              prev: {
                icon: 'chevron-left',
                click: function() {
                  const calendar = calendarRef.current;
                  if (calendar) {
                    calendar.getApi().prev();
                  }
                }
              },
              next: {
                icon: 'chevron-right',
                click: function() {
                  const calendar = calendarRef.current;
                  if (calendar) {
                    calendar.getApi().next();
                  }
                }
              },
              addEventButton: {
                text: "Add Event +",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                click: function(ev: MouseEvent, element: HTMLElement) {
                  setShowToast(true);
                }
              }
            }}
            buttonIcons={{
              prev: 'chevron-left',
              next: 'chevron-right'
            }}
            buttonText={{
              today: 'Today'
            }}
            bootstrapFontAwesome={false}
            timeZone="UTC"
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            dayMaxEvents={true}
            height="auto"
            nextDayThreshold="00:00:00"
            displayEventEnd={true}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
          />
        </div>
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
                Plan your next big moment: schedule or edit an event to stay on
                track
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
                    <label
                      key={key}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="eventColor"
                        value={value}
                        checked={eventLevel === value}
                        onChange={(e) => setEventLevel(e.target.value)}
                        className="hidden"
                      />
                      <div className={`
                        w-12 h-6 rounded-full flex items-center justify-center
                        ${eventLevel === value ? 'ring-2 ring-offset-2 ring-brand-500' : ''}
                        ${value === 'primary' && 'bg-brand-500'}
                        ${value === 'success' && 'bg-success-500'}
                        ${value === 'danger' && 'bg-error-500'}
                        ${value === 'warning' && 'bg-orange-500'}
                        text-white text-sm
                      `}>
                        {key}
                      </div>
                    </label>
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
                    value={eventStartDate}
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
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
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


const renderEventContent = (eventInfo: EventContentArg): JSX.Element => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
// const renderEventContent = (eventInfo: EventContentArg) => {
//   const colorMap = {
//     success: "bg-success-500",
//     danger: "bg-error-500",
//     primary: "bg-brand-500",
//     warning: "bg-orange-500"
//   };

//   const colorClass = colorMap[eventInfo.event.extendedProps.calendar.toLowerCase() as keyof typeof colorMap];

//   return (
//     <div className={`flex items-center w-full gap-2 px-2 py-1 rounded ${colorClass} text-white`}>
//       <div className="fc-event-title">{eventInfo.event.title}</div>
//       {eventInfo.timeText && <div className="fc-event-time">{eventInfo.timeText}</div>}
//     </div>
//   );
// };







