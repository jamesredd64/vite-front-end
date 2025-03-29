/* Main Calendar Container */
.fc {
  /* Main calendar wrapper */
}

/* Header Toolbar */
.fc-toolbar {
  /* Entire header section */
}
.fc-toolbar-title {
  /* Calendar title (month/year) */
}
.fc-button-group {
  /* Group of buttons */
}
.fc-prev-button {
  /* Previous button */
}
.fc-next-button {
  /* Next button */
}
.fc-today-button {
  /* Today button */
}

/* Column Headers (Day names) */
.fc-col-header {
  /* Header row container */
}
.fc-col-header-cell {
  /* Individual header cell */
}
.fc-col-header-cell-cushion {
  /* Text inside header cell */
}

/* Day Grid (Month View) */
.fc-daygrid {
  /* Month view container */
}
.fc-daygrid-day {
  /* Day cell */
}
.fc-daygrid-day-frame {
  /* Frame inside day cell */
}
.fc-daygrid-day-number {
  /* Day number */
}
.fc-daygrid-day-top {
  /* Top part of day cell */
}
.fc-daygrid-day-events {
  /* Events container in day */
}
.fc-daygrid-event-harness {
  /* Event wrapper */
}
.fc-daygrid-dot-event {
  /* Dot event style */
}
.fc-daygrid-more-link {
  /* "more" link */
}

/* Time Grid (Week/Day View) */
.fc-timegrid {
  /* Time grid container */
}
.fc-timegrid-slot {
  /* Time slot */
}
.fc-timegrid-slot-label {
  /* Time label */
}
.fc-timegrid-now-indicator-line {
  /* Current time indicator */
}
.fc-timegrid-event {
  /* Event in time grid */
}

/* Events */
.fc-event {
  /* Base event style */
}
.fc-event-main {
  /* Main event content */
}
.fc-event-title {
  /* Event title */
}
.fc-event-time {
  /* Event time */
}
.fc-event-resizer {
  /* Event resize handle */
}

/* State Classes */
.fc-day-today {
  /* Today's date */
}
.fc-day-past {
  /* Past dates */
}
.fc-day-future {
  /* Future dates */
}
.fc-event-selected {
  /* Selected event */
}
.fc-event-dragging {
  /* Event while dragging */
}

/* List View */
.fc-list {
  /* List view container */
}
.fc-list-day {
  /* Day header in list */
}
.fc-list-event {
  /* Event in list */
}
.fc-list-event-time {
  /* Event time in list */
}
.fc-list-event-title {
  /* Event title in list */
}

/* Popover */
.fc-more-popover {
  /* "More" events popover */
}
.fc-popover-header {
  /* Popover header */
}
.fc-popover-body {
  /* Popover content */
}

/* Common States */
.fc-highlight {
  /* Highlighted area */
}
.fc-non-business {
  /* Non-business hours */
}

/* Example Usage with Tailwind */
.fc .fc-col-header-cell {
  @apply bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-300 !important;
}

.fc .fc-daygrid-day {
  @apply bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 !important;
}

.fc .fc-event {
  @apply rounded-md border-none shadow-sm !important;
}

/* Event Colors */
.fc-event-primary {
  @apply bg-brand-500 text-white !important;
}

.fc-event-success {
  @apply bg-success-500 text-white !important;
}

.fc-event-danger {
  @apply bg-error-500 text-white !important;
}

.fc-event-warning {
  @apply bg-warning-500 text-gray-900 !important;
}