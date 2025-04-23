interface Attendee {
  name: string;
  email: string;
}

interface ICalEventParams {
  timestamp?: Date;
  startTime: Date;
  endTime: Date;
  summary?: string;
  description?: string;
  location?: string;
  organizerName?: string;
  organizerEmail?: string;
  to: Attendee;
}

const formatDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export function generateICalEvent({
  timestamp = new Date(),
  startTime,
  endTime,
  summary = 'Team Meeting',
  description = 'Team meeting to discuss progress and upcoming tasks.',
  location = 'Main Conference Room',
  organizerName = 'James Redd',
  organizerEmail = 'jameshredd@outlook.com',
  to
}: ICalEventParams): string {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
METHOD:REQUEST
BEGIN:VEVENT
DTSTAMP:${formatDate(timestamp)}
DTSTART:${formatDate(startTime)}
DTEND:${formatDate(endTime)}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}
ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${to.name}:mailto:${to.email}
END:VEVENT
END:VCALENDAR`;
}
