/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth0, User } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import UsersLookup from './UsersLookup';
import { CalendarEvent } from '../types/calendar.types';
import  Button  from '../components/ui/button/Button';
import  Input  from '../components/form/input/InputField';
import  Select  from '../components/form/Select';
import  Textarea  from '../components/form/input/TextArea';
import { Dialog, DialogContent } from '../components/ui/dialog/Dialog';
import type UserMetadata from '../types/user';
import { EmailService } from '../services/email.service';
import { generateICalEvent } from '../scripts/emailer';
import Switch from '../components/form/switch/Switch';
import { API_CONFIG } from '../config/api.config';
import Alert from '../components/ui/alert/Alert';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/datepicker-custom.css';

interface EventFormData {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  calendar: "primary" | "success" | "danger" | "warning";
  description: string;
  location: string;
  sendLater: boolean;
  scheduledTime?: string;
}

interface SelectedUser {
  email: string;
  name: string;
}

const EventInvitation: React.FC = () => {
  const { user } = useAuth0();
  const [showUserLookup, setShowUserLookup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [users, setUsers] = useState<UserMetadata[]>([]);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    start: '',
    end: '',
    allDay: false,
    calendar: 'primary',
    description: '',
    location: '',
    sendLater: false,
    scheduledTime: ''
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (statusMessage) {
      timeoutId = setTimeout(() => {
        setStatusMessage(null);
      }, 5000); // 5 seconds
    }

    // Cleanup function to clear timeout if component unmounts or status changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [statusMessage]); // Dependency on statusMessage

  // Early return if no user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Event templates for quick selection
  const eventTemplates = [
    {
      name: 'Strategic Planning Meeting',
      template: {
        title: 'Strategic Planning Meeting',
        description: 'Q2 2024 strategic planning session with leadership team',
        location: 'Conference Room A',
        calendar: 'primary' as const,
        allDay: false
      }
    },
    {
      name: 'Product Launch',
      template: {
        title: 'Product Launch',
        description: 'Official launch of new product line',
        location: 'Main Auditorium',
        calendar: 'success' as const,
        allDay: true
      }
    },
    {
      name: 'Team Training Day',
      template: {
        title: 'Team Training Day',
        description: 'Full-day team training on new technologies',
        location: 'Training Center',
        calendar: 'primary' as const,
        allDay: true
      }
    }
  ];

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = eventTemplates.find(t => t.name === e.target.value);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        ...selected.template
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleDateChange = (date: Date | null, field: 'start' | 'end' | 'scheduledTime') => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: date.toISOString().slice(0, 16) // Format to match datetime-local format
      }));
    }
  };

  const handleUserSelect = (auth0Ids: string[], usersData: UserMetadata[]) => {
    if (formData.sendLater) {
      return;
    }
    
    setUsers(usersData);
    const selectedUserDetails = auth0Ids.map(id => {
      const userDetails = usersData.find(u => u.auth0Id === id) || {
        email: '',
        firstName: '',
        lastName: '',
        auth0Id: id
      };
      return {
        email: userDetails.email || '',
        name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || `Unknown User (${id})`
      };
    });
    
    setSelectedUsers(selectedUserDetails);
    setShowUserLookup(false);
  };

  const handleSendInvitations = async () => {
    if (formData.sendLater) {
      await handleScheduleInvitations();
      return;
    }

    try {
      // Verify we have a logged-in user and selected users
      // if (!user?.email || selectedUsers.length === 0) {
      //   alert('Please ensure you are logged in and have selected attendees');
      //   return;
      // }

      // Send invitation to each selected user
      await Promise.all(selectedUsers.map(async (attendee) => {
        const eventDetails = {
          startTime: new Date(formData.start),
          endTime: new Date(formData.end),
          summary: formData.title,
          description: formData.description,
          location: formData.location,
          organizer: {
            name: user?.name || user?.email?.split('@')[0] || 'Unknown User',
            email: user?.email
          },
          to: {
            name: attendee.name,
            email: attendee.email
          }
        };

        const mailOptions = {
          from: user?.email || 'noreply@yourdomain.com', // Add a default fallback email
          to: attendee.email,
          subject: formData.title,
          text: 'Please find the calendar event attached.',
          html: '<p>Please find the calendar event attached. Click to add to your calendar.</p>',
          icalEvent: {
            filename: 'invitation.ics',
            method: 'REQUEST',
            content: generateICalEvent(eventDetails)
          }
        };

        await EmailService.sendEventInvitation({
          ...eventDetails,
          organizer: {
            name: user?.name || user?.email?.split('@')[0] || 'Unknown User',
            email: user?.email || ''
          }
        }, mailOptions);
      }));

      setStatusMessage({
        type: 'success',
        title: 'Success',
        message: 'Invitations sent successfully!'
      });
    } catch (error) {
      console.error('Error sending invitations:', error);
      setStatusMessage({
        type: 'error',
        title: 'Error',
        message: 'Failed to send invitations. Please try again.'
      });
    }
  };

  const handleScheduleInvitations = async () => {
    try {
      // if (!user?.email) {
      //   alert('Please ensure you are logged in');
      //   return;
      // }

      const scheduledEventData = {
        eventDetails: {
          startTime: new Date(formData.start),
          endTime: new Date(formData.end),
          summary: formData.title,
          description: formData.description,
          location: formData.location,
          organizer: {
            name: user.name || user.email?.split('@')[0] || 'Unknown User',
            email: user.email
          }
        },
        scheduledTime: new Date(formData.scheduledTime || ''),
        selectedUsers: selectedUsers
      };

      console.log('Attempting to schedule event with data:', scheduledEventData);
      try {
        console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
        const fullUrl = `${API_CONFIG.BASE_URL}/email/schedule-event-invitation`;
        console.log('Full URL:', fullUrl);
        
        const requestBody = JSON.stringify(scheduledEventData);
        console.log('Request body:', requestBody);

        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add CORS headers if needed
            'Accept': 'application/json'
          },
          body: requestBody
        }).catch(error => {
          console.error('Fetch error:', error);
          throw error;
        });

        if (!response) {
          throw new Error('No response received from the server');
        }

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const responseData = await response.json();
        console.log('Response data:', responseData);

        if (!response.ok) {
          throw new Error(`Server error: ${responseData.message || response.statusText}`);
        }

        // Clear form or reset state after successful scheduling
        setFormData({
          title: '',
          start: '',
          end: '',
          allDay: false,
          calendar: 'primary',
          description: '',
          location: '',
          sendLater: false,
          scheduledTime: ''
        });
        setSelectedUsers([]);

        setStatusMessage({
          type: 'success',
          title: 'Success',
          message: `Event scheduled successfully! Invitations will be sent at ${new Date(formData.scheduledTime || '').toLocaleString()}`
        });
      } catch (error) {
        console.error('Error scheduling invitations:', error);
        setStatusMessage({
          type: 'error',
          title: 'Error',
          message: 'Failed to schedule invitations. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error scheduling invitations:', error);
      setStatusMessage({
        type: 'error',
        title: 'Error',
        message: 'Failed to schedule invitations. Please try again.'
      });
    }
  };

  return (
    <>
      <PageMeta title="Create and send event invitations | Dashboard" description="Create and send event invitations" />
      <PageBreadcrumb pageTitle="Create and send event invitations" />

      <div className="flex justify-center">
        <div className="relative w-3/4 p-4 overflow-y-auto bg-white border border-gray-200 dark:border-gray-700 no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Create Event Invitation
            </h2>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              Event Template
            </label>
            <Select
              options={eventTemplates.map(template => ({
                value: template.name,
                label: template.name
              }))}
              onChange={(value) => {
                const selected = eventTemplates.find(t => t.name === value);
                if (selected) {
                  setFormData(prev => ({
                    ...prev,
                    ...selected.template
                  }));
                }
              }}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
              placeholder="Select a template or create custom"
            />
          </div>

          <div className="mb-4.5 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="mb-2.5 block text-black dark:text-white">
                Event Title
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
              />
            </div>

            <div className="flex gap-4 w-full">
              <div className="w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Start Date & Time
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.start ? new Date(formData.start) : null}
                    onChange={(date) => handleDateChange(date, 'start')}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select date and time (e.g., January 1, 2024 2:30 PM)"
                    className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none transition 
                      focus:border-brand-500 active:border-brand-500 
                      disabled:cursor-default disabled:bg-gray-50
                      dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-500
                      placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    calendarClassName="!font-sans"
                    timeClassName={(time: Date) => "dark:text-white"}
                    timeIntervals={15}
                    timeCaption="Time"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  End Date & Time
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.end ? new Date(formData.end) : null}
                    onChange={(date) => handleDateChange(date, 'end')}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select date and time (e.g., January 1, 2024 3:30 PM)"
                    className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none transition 
                      focus:border-brand-500 active:border-brand-500 
                      disabled:cursor-default disabled:bg-gray-50
                      dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-500
                      placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    calendarClassName="!font-sans"
                    timeClassName={(time: Date) => "dark:text-white"}
                    timeIntervals={15}
                    timeCaption="Time"
                    minDate={formData.start ? new Date(formData.start) : undefined}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center w-1/3">
                <input
                  type="checkbox"
                  name="allDay"
                  checked={formData.allDay}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <label className="ml-2 text-black dark:text-white">
                  All Day Event
                </label>
              </div>

              <div className="w-2/3">
                <Select
                  options={[
                    { value: "primary", label: "Primary" },
                    { value: "success", label: "Success" },
                    { value: "danger", label: "Danger" },
                    { value: "warning", label: "Warning" }
                  ]}
                  defaultValue={formData.calendar}
                  onChange={(value) => handleInputChange({ 
                    target: { 
                      name: 'calendar', 
                      value 
                    }
                  } as React.ChangeEvent<HTMLSelectElement>)}
                  className="w-full dark:border-strokedark dark:bg-form-input"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(value) => handleInputChange({ target: { name: 'description', value } } as React.ChangeEvent<HTMLTextAreaElement>)}
                rows={4}
                placeholder="Enter event description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
              />
            </div>

            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Location
              </label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
              />
            </div>

            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Invitees ({selectedUsers.length === users.length ? 'All Users' : selectedUsers.length})
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedUsers.length === users.length ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 
                    border border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      All Users
                    </span>
                    <button
                      onClick={() => setSelectedUsers([])}
                      className="text-gray-400 hover:text-danger transition-colors duration-200
                      dark:text-gray-500 dark:hover:text-danger"
                      aria-label="Remove all users"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  selectedUsers.map((user, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 
                      border border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.name}
                      </span>
                      <button
                        onClick={() => setSelectedUsers(users => users.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-danger transition-colors duration-200
                        dark:text-gray-500 dark:hover:text-danger"
                        aria-label={`Remove ${user.name}`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
              <Button
                type="button"
                onClick={() => setShowUserLookup(true)}
                className="w-full bg-primary text-white hover:bg-opacity-90"
              >
                Add Invitees
              </Button>
            </div>

            <div className="flex items-center gap-4 w-full">
              <div className="w-1/2">
                <Switch
                  defaultChecked={formData.sendLater}
                  onChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      sendLater: checked
                    }));
                    setStatusMessage(null);
                  }}
                  label="Schedule for Later"
                />
                
                {formData.sendLater && (
                  <div className="relative mt-2">
                    <DatePicker
                      selected={formData.scheduledTime ? new Date(formData.scheduledTime) : null}
                      onChange={(date) => handleDateChange(date, 'scheduledTime')}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="Select send date and time (e.g., January 1, 2024 9:00 AM)"
                      minDate={new Date()}
                      className="w-full rounded-lg border-[1.5px] border-gray-200 bg-transparent px-5 py-3 outline-none transition 
                        focus:border-brand-500 active:border-brand-500 
                        disabled:cursor-default disabled:bg-gray-50
                        dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-500
                        placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      calendarClassName="!font-sans"
                      timeClassName={(time: Date) => "dark:text-white"}
                      timeIntervals={15}
                      timeCaption="Time"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-1/2">
                {statusMessage && (
                  <Alert
                    variant={statusMessage.type}
                    title={statusMessage.title}
                    message={statusMessage.message}
                  />
                )}
              </div>
            </div>

            <div className="w-full">
              <Button
                type="button"
                onClick={handleSendInvitations}
                disabled={
                  formData.sendLater 
                    ? !formData.title || !formData.scheduledTime
                    : !formData.title || selectedUsers.length === 0
                }
                className="w-full relative font-normal font-sans z-[1] bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300 disabled:cursor-not-allowed"
              >
                {formData.sendLater ? 'Schedule Invitations' : 'Send Invitations'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog 
        isOpen={showUserLookup} 
        onClose={() => setShowUserLookup(false)}
        title="Select Users"
        size="xl"
      >
        <DialogContent>
          <UsersLookup
            isModal={true}
            onUserSelect={handleUserSelect}
            onClose={() => setShowUserLookup(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventInvitation;







































































