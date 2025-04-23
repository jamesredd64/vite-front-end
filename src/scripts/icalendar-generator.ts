import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface Attendee {
  name: string;
  email: string;
}

interface ICalEventParams {
  uid?: string;
  timestamp?: Date;
  startTime: Date;
  endTime: Date;
  summary?: string;
  description?: string;
  location?: string;
  organizerName?: string;
  organizerEmail?: string;
  to: Attendee; // Single object containing attendee name and email
}

const formatDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export function generateICalEvent({
  uid = crypto.randomBytes(16).toString('hex'),
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
  
  // Read template file
  const templatePath = path.join(__dirname, 'templates', 'meeting.ics.template');
  const template: string = fs.readFileSync(templatePath, 'utf8');

  // Replace variables in template
  const variables: Record<string, string> = {
    uid,
    timestamp: formatDate(timestamp),
    startTime: formatDate(startTime),
    endTime: formatDate(endTime),
    summary,
    description,
    location,
    organizerName,
    organizerEmail,
    attendeeName: to.name,
    attendeeEmail: to.email
  };

  // Replace all variables in template
  return template.replace(/\${(\w+)}/g, (_, variable) => variables[variable] || _);
}
