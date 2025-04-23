/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
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
import { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";
import { DateTimePickerProps } from "react-flatpickr";
import Loader from "../components/common/Loader";
// import  AppLayout from "../layout/AppLayout";

// Create a wrapper component
const DatePicker = React.forwardRef<Flatpickr, DateTimePickerProps>(
  (props, ref) => {
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
// import { Modal } from "../components/ui/modal";
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
import { useSidebar } from '../context/SidebarContext';

import type { CalendarEvent } from "../types/calendar.types";

// type CustomFlatpickrProps = Omit<DateTimePickerProps, 'render'> & {
//   render?: (
//     props: Omit<DateTimePickerProps, 'render' | 'options'>,
//     ref: (node: HTMLInputElement | null) => void
//   ) => ReactElement<unknown, string | JSXElementConstructor<any>>;
// };

const CalendarEvent: React.FC = () => {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const { openModal, closeModal } = useModal();
  const location = useLocation();
  // const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventAttendees, setEventAttendees] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventLocation, setEventLocation] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newAttendee, setNewAttendee] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventSummary, setEventSummary] = useState<string>("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [calendarZIndex, setCalendarZIndex] = useState(10);
  const [formZIndex, setFormZIndex] = useState(0);
  const { isExpanded, isHovered } = useSidebar();

  const toggleFormVisibility = (show: boolean) => {
    console.log("Toggling form visibility:", show);
    if (show) {
      setFormZIndex(10);
      setCalendarZIndex(0);
    } else {
      setFormZIndex(0);
      setCalendarZIndex(10);
    }
    setIsFormVisible(show);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    onOpen: (
      _selectedDates: Date[],
      _dateStr: string,
      instance: FlatpickrInstance
    ) => {
      const flatpickrCalendar = (instance as FlatpickrInstance)
        .calendarContainer;

      if (flatpickrCalendar) {
        // Bring dropdown into view partially
        flatpickrCalendar.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  useEffect(() => {
    const loadEvents = async () => {
      if (!user?.sub) {
        setIsLoading(false);
        return;
      }

      try {
        const fetchedEvents = await fetchCalendarEvents(user.sub);

        const eventsArray = Array.isArray(fetchedEvents) ? fetchedEvents : [];

        setEvents(
          eventsArray.map((event) => ({
            ...event,
            id: event.id || crypto.randomUUID(), // Ensure id is always defined
            title: event.title,
            start: new Date(event.start).toISOString(),
            end: new Date(event.end).toISOString(),
            extendedProps: {
              calendar: event.extendedProps?.calendar || "primary",
              summary: event.extendedProps?.summary || "",
              location: event.extendedProps?.location || "",
              attendees: event.extendedProps?.attendees || [],
            },
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.sub, setEvents]);

  // Show loading state
  if (isLoading) {
    return <Loader size="large" />;
  }

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    console.log("Date Select Event:", {
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      view: selectInfo.view.type,
    });

    // Check if this is a drag-drop operation by looking for a specific class
    const isDragDrop = document.querySelector(".fc-event-is-dragging");
    if (isDragDrop) {
      console.log("Drag-drop operation detected, ignoring date select");
      return;
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

    // Show form and scroll to it
    setIsFormVisible(true);

    // Add a small delay before scrolling
    setTimeout(() => {
      const formElement = document.getElementById("event-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log('Event Click:', {
      eventId: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      allDay: clickInfo.event.allDay
    });

    // Prevent any default touch behavior
    if (clickInfo.jsEvent) {
      clickInfo.jsEvent.preventDefault();
    }

    const event = clickInfo.event;
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

    console.log('Event modal data prepared:', {
      title: event.title,
      startDate,
      endDate,
      calendar: event.extendedProps.calendar
    });

    // Add small delay for mobile
    setTimeout(() => {
      openModal();
    }, 50);
  };

  const handleAddOrUpdateEvent = async () => {
    console.log("Attempting to add/update event");

    if (
      !areRequiredFieldsFilled() ||
      !isValidDateRange(eventStartDate, eventEndDate)
    ) {
      console.warn("Validation failed:", {
        fieldsValid: areRequiredFieldsFilled(),
        dateRangeValid: isValidDateRange(eventStartDate, eventEndDate),
      });
      return;
    }

    const eventData = {
      title: eventTitle,
      start: new Date(eventStartDate).toISOString(),
      end: new Date(eventEndDate).toISOString(),
      allDay: true,
      auth0Id: user?.sub ?? "",
      extendedProps: {
        calendar: eventLevel as "primary" | "success" | "danger" | "warning",
        summary: eventSummary,
        location: eventLocation,
        attendees: eventAttendees.map((email) => ({
          email,
          name: email.split("@")[0],
        })),
      },
    };

    console.log("Processing event data:", eventData);

    try {
      if (selectedEvent) {
        if (!selectedEvent.id) throw new Error("Event ID is missing");
        console.log("Updating existing event:", selectedEvent.id);
        await updateCalendarEvent(selectedEvent.id, eventData);
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id ? { ...event, ...eventData } : event
          )
        );
      } else {
        console.log("Creating new event");
        const newEvent = await createCalendarEvent(eventData);
        console.log("New event created:", newEvent);
        const newEventWithId = {
          ...newEvent,
          id: newEvent.id || crypto.randomUUID(),
        };
        setEvents((prev) => [...prev, newEventWithId]);
      }

      // Toggle form visibility and z-index
      toggleFormVisibility(false);
      
      // Reset form fields
      resetModalFields();
      
      // Reset selected event
      setSelectedEvent(null);

    } catch (error) {
      console.error("Error saving event:", error);
      setError("Failed to save event. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) {
      console.warn("Delete attempted without event ID");
      setError("No event selected for deletion");
      return;
    }
    console.log("Initiating delete for event:", selectedEvent.id);
    setShowDeleteConfirmation(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const confirmDelete = async () => {
    if (!selectedEvent?.id) return;

    console.log("Confirming deletion of event:", selectedEvent.id);
    try {
      await deleteCalendarEvent(selectedEvent.id);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEvent.id)
      );
      console.log("Event successfully deleted");
      closeModal();
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event. Please try again.");
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
      eventTitle.trim() && eventStartDate && eventEndDate && eventLevel
    );
  };

  return (
    <div className="calendar-container">
      <PageMeta
        title="Calendar Dashboard "
        description="This is React.js Calendar"
      />
         
      <PageBreadcrumb pageTitle="Calendar" />
      <Toast
        message="Please click on a date to add an event!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="info"
        position="center"
      />
    
      {error && (
        <div className="p-2 mb-4 rounded-lg bg-error-50 text-error-500">
          <p>{error}</p>
        </div>
      )}
      <div className="p-2 md:p-6 2xl:p-3">
        <div className="rounded-2xl border  bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={true}
            eventStartEditable={true}
            eventDurationEditable={true}
            droppable={true}
            dragRevertDuration={0}
            dragScroll={true}
            snapDuration={"00:15:00"}
            eventOverlap={true}
            eventDragStart={handleEventDragEnter}
            eventDragStop={(info) => {
              console.log("Drag stopped:", info);
              const cell = info.el;
              cell.classList.remove("is-dragging");
            }}
            eventLeave={handleEventDragLeave}
            eventDrop={handleCalendarEventDrop}
            dropAccept=".fc-event"
            drop={(info) => {
              console.log("External item dropped:", info);
            }}
            eventReceive={(info) => {
              console.log("External event received:", info);
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
            selectLongPressDelay={1000}
            eventLongPressDelay={1000}
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            selectMirror={true}
            select={handleDateSelect}
            longPressDelay={0}
            selectMinDistance={0}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={{
              addEventButton: {
                text: "Add Event +",
                click: function () {
                  const today = new Date();
                  const tomorrow = new Date();
                  tomorrow.setDate(today.getDate() + 1);

                  const startDate = today.toISOString().split("T")[0];
                  const endDate = tomorrow.toISOString().split("T")[0];

                  console.log("Setting default dates for new event:", {
                    startDate,
                    endDate
                  });

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
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
          />
        </div>

        {/* Event Form */}
        <div
          id="event-form"
          className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 bg-gray-50/95 dark:bg-gray-900/95 ${
            formZIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } lg:ml-[${isExpanded || isHovered ? '290px' : '90px'}] mt-[64px]`}
          style={{ 
            zIndex: formZIndex
          }}
        >
          {/* Form Panel */}
          <div className="w-1/2 max-h-[90vh] overflow-y-auto transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:p-6 dark:bg-white/[0.03] dark:border dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedEvent ? "Edit Event" : "Add Event"}
              </h2>
              <button
                onClick={() => toggleFormVisibility(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter event title"
                />
              </div>

              {/* Summary Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Summary
                </label>
                <textarea
                  value={eventSummary}
                  onChange={(e) => setEventSummary(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter event summary"
                  rows={3}
                />
              </div>

              {/* Date Inputs and Location in Grid */}
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <DatePicker
                    value={eventStartDate}
                    onChange={([date]) => setEventStartDate(date?.toISOString().split('T')[0] || '')}
                    options={datePickerOptions}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <DatePicker
                    value={eventEndDate}
                    onChange={([date]) => setEventEndDate(date?.toISOString().split('T')[0] || '')}
                    options={datePickerOptions}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter event location"
                  />
                </div>
              </div>

              {/* Calendar Type Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calendar
                </label>
                <select
                  value={eventLevel}
                  onChange={(e) => setEventLevel(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select a calendar</option>
                  <option value="primary">Primary</option>
                  <option value="success">Success</option>
                  <option value="danger">Danger</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => toggleFormVisibility(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrUpdateEvent}
                  className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:hover:bg-brand-400"
                >
                  {selectedEvent ? "Update Event" : "Add Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatEventDate = (date: Date | null): string => {
  if (!date) return "";

  // Create a UTC date to prevent timezone shifts
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Force UTC timezone
  }).format(utcDate);
};

const renderEventContent = (eventInfo: EventContentArg): JSX.Element => {
  // Get the current view type from the calendar
  const currentView = "dayGridMonth"; // Default to month view since we can't access ref here

  // Determine tooltip placement based on view type
  const tooltipPlacement = currentView === "dayGridMonth" ? "top" : "right";

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

export default CalendarEvent;
