import { DateSelectArg, EventClickArg, EventDragStartArg, EventLeaveArg, EventDropArg } from "@fullcalendar/core";
import { CalendarEvent } from "../types/calendar.types";

export class CalendarEventHandlers {
  constructor(
    private setSelectedEvent: (event: CalendarEvent | null) => void,
    private setEventTitle: (title: string) => void,
    private setEventStartDate: (date: string) => void,
    private setEventEndDate: (date: string) => void,
    private setEventLevel: (level: string) => void,
    private setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>,
    private openModal: () => void,
    private user?: { sub: string }
  ) {}

  handleDateSelect = (selectInfo: DateSelectArg) => {
    if (selectInfo.jsEvent) {
      selectInfo.jsEvent.preventDefault();
      selectInfo.jsEvent.stopPropagation();
    }

    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    this.resetModalFields();
    
    const startDate = selectInfo.startStr;
    this.setEventStartDate(startDate);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = endDate.toISOString().split("T")[0];
    this.setEventEndDate(endDateStr);

    setTimeout(() => {
      this.openModal();
    }, 100);
  };

  handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.jsEvent) {
      clickInfo.jsEvent.preventDefault();
    }

    const event = clickInfo.event;
    this.setSelectedEvent(event as unknown as CalendarEvent);
    this.setEventTitle(event.title);
    
    const startDate = event.start
      ? event.start.toISOString().split("T")[0]
      : event.startStr.split("T")[0];
    this.setEventStartDate(startDate);

    const endDate = event.end
      ? event.end.toISOString().split("T")[0]
      : event.endStr.split("T")[0];
    this.setEventEndDate(endDate);

    this.setEventLevel(event.extendedProps.calendar);

    setTimeout(() => {
      this.openModal();
    }, 50);
  };

  handleEventDragStart = (info: EventDragStartArg) => {
    if (info.el) {
      info.el.classList.add("fc-event-is-dragging");
      document.body.style.cursor = "move";
    }
  };

  handleEventDragStop = (info: EventDragStartArg) => {
    if (info.el) {
      info.el.classList.remove("fc-event-is-dragging");
      document.body.style.cursor = "default";
    }
  };

  handleEventDragEnter = (info: EventDragStartArg) => {
    if (info.el) {
      info.el.classList.add("drop-target-active");
    }
  };

  handleEventDragLeave = (info: EventLeaveArg) => {
    if (info.draggedEl) {
      const dropTargets = document.querySelectorAll(".drop-target-active");
      dropTargets.forEach((el) => el.classList.remove("drop-target-active"));
    }
  };

  handleCalendarEventDrop = async (dropInfo: EventDropArg) => {
    // Your existing event drop logic here
  };

  private resetModalFields = () => {
    this.setEventTitle("");
    this.setEventStartDate("");
    this.setEventEndDate("");
    this.setEventLevel("");
    this.setSelectedEvent(null);
  };

  createEventData = (date: string) => {
    const utcDate = new Date(
      Date.UTC(
        new Date(date).getUTCFullYear(),
        new Date(date).getUTCMonth(),
        new Date(date).getUTCDate(),
        0, 0, 0, 0
      )
    );
    return utcDate.toISOString();
  };

  createEndDate = (date: string) => {
    const utcDate = new Date(
      Date.UTC(
        new Date(date).getUTCFullYear(),
        new Date(date).getUTCMonth(),
        new Date(date).getUTCDate(),
        23, 59, 59, 999
      )
    );
    return utcDate.toISOString();
  };
}