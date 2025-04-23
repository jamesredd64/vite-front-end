import { Schema } from "mongoose";

/* eslint-disable @typescript-eslint/no-unused-vars */
const CalendarEventSchema = new Schema({
  // ... existing fields ...
  extendedProps: {
    calendar: { type: String, enum: ['primary', 'success', 'danger', 'warning'], required: true },
    summary: String,
    location: String,
    isAllUsersInvited: { type: Boolean, default: false },
    attendees: [{
      email: String,
      name: String
    }]
  }
});

