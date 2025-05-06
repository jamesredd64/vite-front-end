import { useState, useRef, useEffect, forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
} from "@fullcalendar/core";
import { EventDragStartArg, EventLeaveArg } from "@fullcalendar/interaction";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";
import { DateTimePickerProps } from "react-flatpickr";
import Loader from "../components/common/Loader";

// Create a wrapper component
const DatePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  (props, ref) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Ignore the type error for Flatpickr component
    return <Flatpickr {...props} ref={ref} />;
  }
);

DatePicker.displayName = "DatePicker";

// import { ReactElement, JSXElementConstructor } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  EventResizeStartArg,
  EventResizeStopArg,
} from "@fullcalendar/interaction";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
// import ChevronLeftIcon from '../icons/chevron-left.svg?react';
// import ChevronRightIcon from '../icons/chevron-right.svg?react';
import { useAuth0 } from "@auth0/auth0-react";
import { useMongoDbClient } from "../services/mongoDbClient";
import Toast from "../components/ui/Toast";
import { useLocation } from "react-router-dom";
import { useCalendar } from "../context/CalendarContext";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../styles/calendar.css";
import "flatpickr/dist/themes/light.css";
// import { useNavigate } from 'react-router-dom';

import type { CalendarEvent } from "../types/calendar.types";

// type CustomFlatpickrProps = Omit<DateTimePickerProps, 'render'> & {
//   render?: (
//     props: Omit<DateTimePickerProps, 'render' | 'options'>,
//     ref: (node: HTMLInputElement | null) => void
//   ) => ReactElement<unknown, string | JSXElementConstructor<any>>;
// };

const Calendar: React.FC = () => {
  const { user } = useAuth0();
  const {
    fetchCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
  } = useMongoDbClient();
  const { events, setEvents } = useCalendar();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState<string>(""); // Stores ISO datetime
  const [eventEndDate, setEventEndDate] = useState<string>(""); // Stores ISO datetime
  // const [eventStartDate, setEventStartDate] = useState("");
  // const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const location = useLocation();
  // const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  const datePickerOptions = {
    dateFormat: "Y-m-d",
    enableTime: false,
    altInput: true,
    altFormat: "F j, Y",
    static: true,
    theme: "light",
    onChange: (selectedDates: Date[], dateStr: string, instance: unknown) => {
      // Trigger custom change event
      (instance as { element: HTMLElement }).element.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    },
    onOpen: (_selectedDates: Date[], _dateStr: string, instance: FlatpickrInstance) => {
      const flatpickrCalendar = (instance as FlatpickrInstance).calendarContainer;
  
      if (flatpickrCalendar) {
        // Bring dropdown into view partially
        flatpickrCalendar.scrollIntoView({ behavior: "smooth", block: "nearest" });
  
        // Optionally add a class to control custom styles on open
        flatpickrCalendar.classList.add("datepicker-partial-scroll");
      }
    },
  };
  

  // Add this useEffect to handle navigation to specific events
  useEffect(() => {
    const state = location.state as {
      selectedEventId?: string;
      scrollToEvent?: boolean;
    };
    if (state?.selectedEventId && state?.scrollToEvent && calendarRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const calendar = calendarRef.current?.getApi();
        if (!calendar) return;

        if (!state.selectedEventId) return;
        const event = calendar.getEventById(state.selectedEventId);
        if (!event) return;

        // Go to the date of the event
        calendar.gotoDate(event.start || new Date());

        // Use setTimeout to ensure the calendar has updated
        setTimeout(() => {
          // First ensure selectedEventId exists
          if (!state.selectedEventId) return;

          // Get the event and cast it to include the el property
          const event = calendar.getEventById(state.selectedEventId);
          if (!event) return;

          // Access the DOM element using getEl() method
          const eventEl = document.getElementById(
            `event-${state.selectedEventId}`
          );
          if (eventEl) {
            eventEl.scrollIntoView({ behavior: "smooth", block: "center" });

            // Highlight the event
            event.setProp("backgroundColor", "#ffeb3b");

            // Reset the highlight after a delay
            setTimeout(() => {
              event.setProp("backgroundColor", "");
            }, 2000);
          }
        }, 100);
      });
    }
  }, [location.state]);

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  useEffect(() => {
    const loadEvents = async () => {
      // Don't fetch if we already have events and user hasn't changed
      if (events.length > 0 && isInitialized) {
        return;
      }

      if (!user?.sub) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedEvents = await fetchCalendarEvents(user.sub);
        const eventsArray = Array.isArray(fetchedEvents) ? fetchedEvents : [];

        setEvents(
          eventsArray.map((event) => ({
            ...event,
            id: event.id || crypto.randomUUID(),
            title: event.title,
            start: new Date(event.start).toISOString(),
            end: new Date(event.end).toISOString(),
            extendedProps: {
              calendar: event.extendedProps?.calendar || "primary",
            },
          }))
        );
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  // Add isInitialized to dependency array
  }, [user?.sub, setEvents, events.length, isInitialized, fetchCalendarEvents]);

 
  // Show loading state
  if (isLoading) {
    return <Loader size="medium" />;
  }

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Check if this is a drag-drop operation by looking for a specific class
    const isDragDrop = document.querySelector('.fc-event-is-dragging');
    if (isDragDrop) {
      return; // Exit early if we're in a drag-drop operation
    }

    // Prevent any default touch/click behavior
    if (selectInfo.jsEvent) {
      selectInfo.jsEvent.preventDefault();
      selectInfo.jsEvent.stopPropagation();
    }

    // Unselect the date range immediately
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    resetModalFields();
    
    // Set the selected date as start date
    const startDate = selectInfo.startStr;
    setEventStartDate(startDate);
    
    // Set end date to the next day
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = endDate.toISOString().split("T")[0];
    setEventEndDate(endDateStr);

    console.log("Selected date:", startDate);
    // console.log("Today's date:", today);
    // console.log("Is valid date:", startDate >= today);

    // Add delay for modal to ensure state is updated
    setTimeout(() => {
      openModal();
    }, 100);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // Prevent any default touch behavior
    if (clickInfo.jsEvent) {
      clickInfo.jsEvent.preventDefault();
    }

    const event = clickInfo.event;
    console.log("Clicked event data:", event);

    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    
    // For existing events, preserve the original dates without modification
    const startDate = event.start
      ? event.start.toISOString().split("T")[0]
      : event.startStr.split("T")[0];
    setEventStartDate(startDate);

    const endDate = event.end
      ? event.end.toISOString().split("T")[0]
      : event.endStr.split("T")[0];
    setEventEndDate(endDate);

    setEventLevel(event.extendedProps.calendar);

    // Add small delay for mobile
    setTimeout(() => {
      openModal();
    }, 50);
  };

  const handleAddOrUpdateEvent = async () => {
    console.log("Starting handleAddOrUpdateEvent");
    console.log("Current form values:", {
      eventTitle,
      eventStartDate,
      eventEndDate,
      eventLevel,
      selectedEvent: selectedEvent ? selectedEvent.id : "none",
    });

    if (!user?.sub) {
      console.error("No user ID available");
      return;
    }

    try {
      const createEventData = (date: string) => {
        const utcDate = new Date(
          Date.UTC(
            new Date(date).getUTCFullYear(),
            new Date(date).getUTCMonth(),
            new Date(date).getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
        console.log(
          `Converting start date ${date} to UTC:`,
          utcDate.toISOString()
        );
        return utcDate.toISOString();
      };

      const createEndDate = (date: string) => {
        const utcDate = new Date(
          Date.UTC(
            new Date(date).getUTCFullYear(),
            new Date(date).getUTCMonth(),
            new Date(date).getUTCDate(),
            23,
            59,
            59,
            999
          )
        );
        return utcDate.toISOString();
      };     
      

      
if (selectedEvent) {
  console.log("Updating existing event:", selectedEvent.id);
  const updatedEventData = {
    title: eventTitle,
    start: createEventData(eventStartDate), // Use exact start date
    end: createEndDate(eventEndDate),      // Use end-of-day logic
    allDay: true,
    auth0Id: user.sub,
    extendedProps: {
      calendar: eventLevel as "primary" | "success" | "danger" | "warning",
    },
  };
  if (!selectedEvent.id) throw new Error("Event ID is missing");
  await updateCalendarEvent(selectedEvent.id, updatedEventData);
  setEvents((prevEvents) =>
    prevEvents.map((event) =>
      event.id === selectedEvent.id ? { ...event, ...updatedEventData } : event
    )
  );
}

else {
        console.log("Creating new event");
        const newEventData = {
          title: eventTitle,
          start: createEventData(eventStartDate),
          end: createEndDate(eventEndDate),
          allDay: true,
          auth0Id: user.sub,
          extendedProps: {
            calendar: eventLevel as
              | "primary"
              | "success"
              | "danger"
              | "warning",
          },
        };
        console.log("New event data:", newEventData);

        const savedEvent = await createCalendarEvent(newEventData);
        console.log("Event created successfully:", savedEvent);

        if (!savedEvent.id) {
          throw new Error("Server returned event without ID");
        }

        const newEvent = {
          ...newEventData,
          id: savedEvent.id,
          extendedProps: {
            calendar: eventLevel as
              | "primary"
              | "success"
              | "danger"
              | "warning",
          },
        };

        setEvents((prevEvents) => [...prevEvents, newEvent]);
      }

      // Close modal and reset fields ONLY after successful save
      closeModal();
      resetModalFields();
    }
    catch (error) {
      console.error("Failed to save event:", error);
      setError(error instanceof Error ? error.message : "Failed to save event");
      // Don't close modal on error so user can try again
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) {
      setError("No event selected for deletion");
      return;
    }
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedEvent?.id) {
        throw new Error("Cannot delete event: missing event ID");
      }
      await deleteCalendarEvent(selectedEvent.id);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEvent.id)
      );
      setShowDeleteConfirmation(false);
      closeModal();
      resetModalFields();
    } catch (error) {
      console.error("Failed to delete event:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete event"
      );
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEventDragStart = (info: EventDragStartArg) => {
    console.log("Drag started:", {
      eventId: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
    });

    if (info.el) {
      info.el.classList.add("fc-event-is-dragging");
      document.body.style.cursor = "move";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEventDragStop = (info: EventDragStartArg) => {
    console.log("Drag stopped:", {
      eventId: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      position: {
        x: info.jsEvent.clientX,
        y: info.jsEvent.clientY,
      },
    });

    if (info.el) {
      info.el.classList.remove("fc-event-is-dragging");
      document.body.style.cursor = "default";
    }
  };

  const handleEventDragEnter = (info: EventDragStartArg) => {
    console.log("Drag enter:", {
      date: info.event.start?.toISOString(),
      eventId: info.event.id,
      title: info.event.title,
    });

    // Highlight the drop target
    if (info.el) {
      info.el.classList.add("drop-target-active");
    }
  };

  const handleEventDragLeave = (info: EventLeaveArg) => {
    console.log("Drag leave:", {
      eventId: info.event?.id,
      title: info.event?.title,
    });

    // Remove highlight from previous drop target
    if (info.draggedEl) {
      const dropTargets = document.querySelectorAll(".drop-target-active");
      dropTargets.forEach((el) => el.classList.remove("drop-target-active"));
    }
  };

  const handleCalendarEventDrop = async (dropInfo: EventDropArg) => {
    console.log("Event dropped:", {
      eventId: dropInfo.event.id,
      title: dropInfo.event.title,
      oldStart: dropInfo.oldEvent.startStr,
      oldEnd: dropInfo.oldEvent.endStr,
      newStart: dropInfo.event.startStr,
      newEnd: dropInfo.event.endStr,
      delta: dropInfo.delta,
    });

    try {
      const droppedEvent = dropInfo.event;
      const originalStart = new Date(droppedEvent.start!);
      const originalEnd = new Date(droppedEvent.end!);

      // Calculate event duration in days
      const durationInDays = Math.ceil(
        (originalEnd.getTime() - originalStart.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Get new start date from drop target
      const newStartDate = new Date(
        dropInfo.event.start?.getTime() ?? Date.now()
      );

      // Calculate new end date maintaining the original duration
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newStartDate.getDate() + durationInDays);

      // Prepare event data
      const updatedEventData = {
        title: droppedEvent.title,
        start: newStartDate.toISOString(),
        end: newEndDate.toISOString(),
        allDay: droppedEvent.allDay,
        auth0Id: user?.sub || "",
        extendedProps: {
          calendar: droppedEvent.extendedProps.calendar,
        },
      };

      if (!droppedEvent.id) {
        throw new Error("Event ID is missing");
      }

      // Update in MongoDB
      await updateCalendarEvent(droppedEvent.id, updatedEventData);

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === droppedEvent.id
            ? {
                ...event,
                start: newStartDate.toISOString(),
                end: newEndDate.toISOString(),
              }
            : event
        )
      );

      console.log("Event dropped and updated successfully");
    } catch (error) {
      console.error("Failed to process drop:", error);
      dropInfo.revert();
      setError(
        error instanceof Error ? error.message : "Failed to update event"
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEventResize = async (resizeInfo: EventResizeStopArg) => {
    try {
      const event = resizeInfo.event;
      const updatedEventData = {
        title: event.title,
        start: event.start?.toISOString(),
        end: event.end?.toISOString(),
        allDay: event.allDay,
        auth0Id: user?.sub,
        extendedProps: {
          calendar: event.extendedProps.calendar,
        },
      };

      await updateCalendarEvent(event.id, updatedEventData);

      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event.id
            ? {
                ...e,
                end: event.endStr,
              }
            : e
        )
      );
    } catch (error) {
      console.error("Failed to resize event:", error);
      // Revert the resize by setting dates back to original values
      const originalStart = resizeInfo.event.start;
      const originalEnd = resizeInfo.event.end;
      if (originalStart && originalEnd) {
        resizeInfo.event.setDates(originalStart, originalEnd);
      }
      setError(
        error instanceof Error ? error.message : "Failed to update event"
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const eventAllow = (dropInfo: any, draggedEvent: any) => {
    // Add custom logic here to determine if the event can be dropped
    // For example, prevent dropping on weekends:
    const dropDate = new Date(dropInfo.start);
    const isWeekend = dropDate.getDay() === 0 || dropDate.getDay() === 6;
    return !isWeekend;
  };

  // Add this helper function at component level
  const isValidDateRange = (start: string, end: string): boolean => {
    if (!start || !end) return false;
    return new Date(start) <= new Date(end);
  };

  // Add this helper function to check if all required fields are filled
  const areRequiredFieldsFilled = (): boolean => {
    return Boolean(
      eventTitle.trim() && 
      eventStartDate && 
      eventEndDate && 
      eventLevel
    );
  };

  return (
    <>
      {/* <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/50 lg:p-6"> */}
      <PageMeta
        title="Calendar Dashboard "
        description="This is React.js Calendar"
        />
        {/* </div> */}
      <PageBreadcrumb pageTitle="Calendar" />
      <Toast
        message="Please click on a date to add an event!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="info"
        position="center" // This will center the toast both vertically and horizontally
      />
      {error && (
        <div className="p-2 mb-4 rounded-lg bg-error-50 text-error-500">
          <p>{error}</p>
        </div>
      )}
      <div className="p-2 md:p-6 2xl:p-3">
        <div className="mx-auto max-w-full">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            // Drag-n-drop settings
            editable={true}
            eventStartEditable={true}
            eventDurationEditable={true}
            droppable={true}
            dragRevertDuration={0}
            dragScroll={true}
            snapDuration={"00:15:00"} // Snap to 15-minute intervals
            eventOverlap={true} // Prevent events from overlapping
            // eventOpacity={0.75}

            // Event constraints
            // eventConstraint={{
            //   startTime: "00:00",
            //   endTime: "24:00",
            // }}
            // Drag-n-drop callbacks
            eventDragStart={handleEventDragEnter}
            eventDragStop={(info) => {
              console.log("Drag stopped:", info);
              const cell = info.el;
              cell.classList.remove("is-dragging");
            }}
            eventLeave={handleEventDragLeave}
            eventDrop={handleCalendarEventDrop}
            // External drag-n-drop
            dropAccept=".fc-event"
            drop={(info) => {
              console.log("External item dropped:", info);
            }}
            eventReceive={(info) => {
              console.log("External event received:", info);
              // Handle the new event here
              const newEvent = {
                title: info.event.title,
                start: info.event.start,
                end: info.event.end,
                allDay: info.event.allDay,
                extendedProps: info.event.extendedProps,
              };
              setEvents((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  title: newEvent.title,
                  start:
                    newEvent.start?.toISOString() || new Date().toISOString(),
                  end: newEvent.end?.toISOString() || new Date().toISOString(),
                  allDay: newEvent.allDay ?? true,
                  extendedProps: {
                    calendar: newEvent.extendedProps?.calendar || "primary",
                  },
                },
              ]);
            }}
            // Touch support settings
            selectLongPressDelay={1000} // 1 second for long-press
            eventLongPressDelay={1000} // 1 second for event long-press
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
            selectMirror={true}
            select={handleDateSelect}
            // selectLongPressDelay={0} // Reduce long press delay for mobile
            longPressDelay={0} // Reduce general long press delay
            selectMinDistance={0} // Reduce minimum drag distance for selection
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            // eventResize={handleEventResize}
            // In your FullCalendar component, modify the addEventButton handler:
            customButtons={{
              addEventButton: {
                text: "Add Event +",
                click: function () {
                  // Set start date to today
                  const today = new Date();
                  const tomorrow = new Date();
                  tomorrow.setDate(today.getDate() + 1);

                  // Format dates as YYYY-MM-DD
                  const startDate = today.toISOString().split("T")[0];
                  const endDate = tomorrow.toISOString().split("T")[0];

                  console.log("Setting default dates for new event:", {
                    startDate,
                    endDate
                  });

                  // Set the dates and open modal
                  setEventStartDate(startDate);
                  setEventEndDate(endDate);
                  openModal();
                },
              },
            }}
            buttonIcons={{
              prev: "chevron-left",
              next: "chevron-right",
            }}
            buttonText={{
              today: "Today",
            }}
            bootstrapFontAwesome={false}
            timeZone="UTC"
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            dayMaxEvents={true}
            height="auto"
            nextDayThreshold="23:59:59" 
            displayEventEnd={true}
            // eventConstraint={null}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10 border border-gray-200 dark:border-gray-700"
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
                    Event Title <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    required
                    placeholder="Enter event title"
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Color
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  {Object.entries(calendarsEvents).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    >
                      <input
                        type="radio"
                        name="eventColor"
                        value={value}
                        checked={eventLevel === value}
                        onChange={(e) => setEventLevel(e.target.value)}
                        className="hidden"
                      />
                      <div
                        className={`
                        w-14 h-8 rounded-full flex items-center justify-center px-10
                        ${
                          eventLevel === value
                            ? "ring-2 ring-offset-2 ring-brand-500"
                            : ""
                        }
                        ${value === "primary" && "bg-brand-500"}
                        ${value === "success" && "bg-success-500"}
                        ${value === "danger" && "bg-error-500"}
                        ${value === "warning" && "bg-orange-500"}
                        text-white text-sm
                      `}
                      >
                        {key}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter Start Date <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    value={eventStartDate}
                    onChange={([date]) => {
                      if (date) {
                        const formattedDate = date.toISOString().split("T")[0];
                        setEventStartDate(formattedDate);
                        
                        // If end date is before new start date, update end date
                        if (eventEndDate && new Date(eventEndDate) < new Date(formattedDate)) {
                          const newEndDate = new Date(formattedDate);
                          newEndDate.setDate(newEndDate.getDate() + 1);
                          setEventEndDate(newEndDate.toISOString().split("T")[0]);
                        }
                      }
                    }}
                    options={{
                      ...datePickerOptions,
                      defaultDate: eventStartDate
                    }}
                    required
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter End Date <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    value={eventEndDate}
                    onChange={([date]) => {
                      if (date) {
                        const formattedDate = date.toISOString().split("T")[0];
                        setEventEndDate(formattedDate);
                      }
                    }}
                    options={{
                      ...datePickerOptions,
                      defaultDate: eventEndDate
                    }}
                    required
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            </div>
            <div className="mt-2">
              {!eventTitle.trim() && (
                <p className="text-sm text-error-500">Event Title is required</p>
              )}
              {!eventStartDate && (
                <p className="text-sm text-error-500">Start date is required</p>
              )}
              {!eventEndDate && (
                <p className="text-sm text-error-500">End date is required</p>
              )}
              {!eventLevel && (
                <p className="text-sm text-error-500">Event level Color is required</p>
              )}
              {eventStartDate && eventEndDate && !isValidDateRange(eventStartDate, eventEndDate) && (
                <p className="text-sm text-error-500">End date must be after or equal to start date</p>
              )}
            </div>
            <div className="mt-8 flex justify-end gap-4">
              {selectedEvent && (
                <button
                  onClick={handleDeleteEvent}
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-error-500 px-6 py-2.5 text-center text-sm font-medium text-error-500 hover:bg-error-50 focus:ring-4 focus:ring-error-500/10 dark:border-error-500 dark:hover:bg-error-500/10"
                >
                  Delete Event
                </button>
              )}
              <button
                disabled={!areRequiredFieldsFilled() || !isValidDateRange(eventStartDate, eventEndDate)}
                onClick={handleAddOrUpdateEvent}
                type="button"
                className={`inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-center text-sm font-medium ${
                  !areRequiredFieldsFilled() || !isValidDateRange(eventStartDate, eventEndDate)
                    ? 'bg-gray-300 cursor-not-allowed dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    : 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/10 dark:bg-brand-500 dark:hover:bg-brand-400'
                }`}
              >
                {selectedEvent ? "Update Event" : "Save Event"}
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          className="max-w-[400px] p-6"
        >
          <div className="flex flex-col">
            <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-lg">
              Confirm Deletion
            </h5>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Delete Event
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const formatEventDate = (date: Date | null): string => {
  if (!date) return "";
  
  // Create a UTC date to prevent timezone shifts
  const utcDate = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC" // Force UTC timezone
  }).format(utcDate);
};

const renderEventContent = (eventInfo: EventContentArg): JSX.Element => {
  // Get the current view type from the calendar
  const currentView = 'dayGridMonth'; // Default to month view since we can't access ref here
  
  // Determine tooltip placement based on view type
  const tooltipPlacement = currentView === 'dayGridMonth' ? 'top' : 'right';

  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  const dotColorMap = {
    primary: "bg-brand-500",
    success: "bg-success-500",
    danger: "bg-error-500",
    warning: "bg-orange-500",
  };

  const dotColorClass =
    dotColorMap[
      eventInfo.event.extendedProps.calendar.toLowerCase() as keyof typeof dotColorMap
    ];

  const tooltipContent = (
    <div className="p-2.5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColorClass}`}></span>
          <h6 className="font-medium text-gray-800 dark:text-gray-200">
            {eventInfo.event.title}
          </h6>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Start:</span>{" "}
            {formatEventDate(eventInfo.event.start)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">End:</span>{" "}
            {formatEventDate(eventInfo.event.end)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Tippy
      content={tooltipContent}
      animation="shift-away"
      placement={tooltipPlacement}
      className="!bg-white !text-gray-800 !border !border-gray-200 !shadow-lg !rounded-lg dark:!bg-gray-800 dark:!text-gray-200 dark:!border-gray-700"
      arrow={false}
      delay={[100, 0]}
      interactive={true}
      appendTo={() => document.body} // Add this to ensure tooltip is not constrained
      zIndex={9999} // Add this to ensure tooltip appears above other elements
    >
      <div
        className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm cursor-move`}
        id={`event-${eventInfo.event.id}`}
      >
        <div className="fc-daygrid-event-dot"></div>
        <div className="fc-event-time">{eventInfo.timeText}</div>
        <div className="fc-event-title">{eventInfo.event.title}</div>
      </div>
    </Tippy>
  );
};

export default Calendar;
