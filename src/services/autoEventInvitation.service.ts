import mongoose from 'mongoose';
import { ScheduledEvent } from '../../../../Users/james/Downloads/free-react-tailwind-admin-dashboard-main/TailAdmin-Main/auth0-admin-backend/models/scheduledEvent';
import { User } from '../models/user';
import { EmailService } from './email.service';
import { generateICalEvent } from '../utils/ical.utils';

interface LastRunMetadata {
  lastRunTime: Date;
  processedUserIds: string[];
}

const autoInviteMetadataSchema = new mongoose.Schema({
  lastRunTime: { type: Date, required: true },
  processedUserIds: [{ type: String }],
  eventId: { type: String, required: true }
});

const AutoInviteMetadata = mongoose.model('AutoInviteMetadata', autoInviteMetadataSchema);

export class AutoEventInvitationService {
  static async processNewUsers() {
    try {
      // Find upcoming events (events that haven't started yet)
      const upcomingEvents = await ScheduledEvent.find({
        'eventDetails.startTime': { $gt: new Date() },
        status: 'pending'
      });

      for (const event of upcomingEvents) {
        // Get or create metadata for this event
        let metadata = await AutoInviteMetadata.findOne({ eventId: event._id });
        if (!metadata) {
          metadata = new AutoInviteMetadata({
            lastRunTime: new Date(),
            processedUserIds: [],
            eventId: event._id
          });
        }

        // Find new users created after the last run
        const newUsers = await User.find({
          createdAt: { $gt: metadata.lastRunTime },
          _id: { $nin: metadata.processedUserIds },
          status: 'active'
        });

        if (newUsers.length > 0) {
          // Send invitations to new users
          for (const user of newUsers) {
            try {
              const eventDetails = {
                startTime: event.eventDetails.startTime,
                endTime: event.eventDetails.endTime,
                summary: event.eventDetails.summary,
                description: event.eventDetails.description,
                location: event.eventDetails.location,
                organizer: event.eventDetails.organizer,
                to: {
                  email: user.email,
                  name: `${user.firstName} ${user.lastName}`.trim()
                }
              };

              const mailOptions = {
                from: event.eventDetails.organizer.email,
                to: user.email,
                subject: event.eventDetails.summary,
                text: 'Please find the calendar event attached.',
                html: '<p>Please find the calendar event attached. Click to add to your calendar.</p>',
                icalEvent: {
                  filename: 'invitation.ics',
                  method: 'REQUEST',
                  content: generateICalEvent(eventDetails)
                }
              };

              await EmailService.sendEventInvitation(eventDetails, mailOptions);
              
              // Add user to processed list
              metadata.processedUserIds.push(user._id);
            } catch (error) {
              console.error(`Failed to send invitation to user ${user.email}:`, error);
              // Continue with next user even if one fails
            }
          }
        }

        // Update metadata
        metadata.lastRunTime = new Date();
        await metadata.save();
      }
    } catch (error) {
      console.error('Error in auto event invitation process:', error);
      throw error;
    }
  }
}