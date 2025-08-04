import React, { useEffect, useState } from 'react';
// import { EmailService } from '../services/email.service'; // Assuming EmailService or your new service
import { scheduledEvents } from '../services/scheduledEvents.service';
import { format } from 'date-fns'; // Using date-fns for date formatting
import { jsPDF } from "jspdf";
// import stagholme from "./public/images";
// import { ReactComponent as FileIcon } from '../icons/file.svg';
import {
   LightPdfIcon
  
} from "../icons";

interface Attendee {
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface EventDetails {
  scheduledTime: string;
  // endTime: string;
  summary: string;
  description: string;
  location: string;
  organizer?: {
    name: string;
    email: string | undefined;
  };
}

interface ScheduledEvent {
  _id: string;
  eventDetails: EventDetails;
  selectedUsers: Attendee[];
  scheduledTime: string;
  // createdAt: string;
  status: string;
}
// const generatePDF = (data) => {
//   const doc = new jsPDF();
//   data.forEach((item, index) => {
//     doc.text(`${index + 1}. ${item}`, 10, 10 + (index * 10));
//   });
//   doc.save("list.pdf");
// };

const generatePDF = (events: ScheduledEvent[]) => {
  const doc = new jsPDF({ orientation: "landscape" });
  const margin = 15;
  let yPosition = 50; // Adjusted starting position to account for logo
  const pageWidth = doc.internal.pageSize.width; // Get page width

  // **Centering the Title**
  const title = "Scheduled Events Report";
  const titleWidth = doc.getTextWidth(title);
  const titleX = (pageWidth - titleWidth) / 2; // Calculate center position

  // Add title at the center
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, titleX, yPosition);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  yPosition += 15;

  // Generate Event Content
  events.forEach((event, index) => {
    if (yPosition + 60 > doc.internal.pageSize.height) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(220, 220, 220); // Light Gray Background
    doc.rect(margin, yPosition - 5, 270, 8, "F"); // Background for event header

    doc.setFont("helvetica", "bold");
    doc.text(`Event ${index + 1}: ${event.eventDetails.summary}`, margin, yPosition);
    doc.setFont("helvetica", "normal");

    yPosition += 10;
    doc.text(`Description: ${event.eventDetails.description}`, margin, yPosition);
    doc.text(`DateTime Scheduled: ${format(new Date(event.eventDetails.scheduledTime), "yyyy-MM-dd hh:mm a")}`, margin, yPosition + 10);
    // doc.text(`End Time: ${format(new Date(event.eventDetails.endTime), "yyyy-MM-dd HH:mm")}`, margin, yPosition + 20);
    doc.text(`Location: ${event.eventDetails.location}`, margin, yPosition + 30);
    doc.text(`Organizer: ${event.eventDetails.organizer?.name} (${event.eventDetails.organizer?.email})`, margin, yPosition + 40);
    doc.text(`Status: ${event.status}`, margin, yPosition + 50);

    yPosition += 70;
  });

  doc.save("scheduled-events.pdf");
};

const ScheduledEventsPage: React.FC = () => {
  const [allEvents, setAllEvents] = useState<ScheduledEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6; // Display 6 most recent events per page

  // fetchEvents
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await scheduledEvents.getAllScheduledEvents();
        // Sort events by creation date in descending order
        const sortedEvents = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log("Fetched Events ", sortedEvents);
        setAllEvents(sortedEvents);
        // Select the most recent event by default
        if (sortedEvents.length > 0) {
          setSelectedEvent(sortedEvents[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch scheduled events');
        console.error('Error fetching scheduled events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

  }, []);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = allEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(allEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (event: ScheduledEvent) => {
    setSelectedEvent(event);
  };

  if (loading) {
    return <div>Loading scheduled events...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  // <button onClick={() => generatePDF(listData)}>Export as PDF</button>

// const handleClick = () => {
//   if (selectedEvent) {
//     const eventData = [
//       `Event: ${selectedEvent.eventDetails.summary}`,
//       `Description: ${selectedEvent.eventDetails.description}`,
//       `Start Time: ${format(new Date(selectedEvent.eventDetails.startTime), "yyyy-MM-dd HH:mm")}`,
//       `End Time: ${format(new Date(selectedEvent.eventDetails.endTime), "yyyy-MM-dd HH:mm")}`,
//       `Location: ${selectedEvent.eventDetails.location}`,
//       `Organizer: ${selectedEvent.eventDetails.organizer?.name} (${selectedEvent.eventDetails.organizer?.email})`,
//       `Status: ${selectedEvent.status}`,
//     ];
//     generatePDF(eventData);
//   } else {
//     alert("No event selected to generate PDF.");
//   }
// };

const handleClick = () => {
  if (allEvents.length > 0) {
    generatePDF(allEvents);
  } else {
    alert("No events available to generate PDF.");
  }
};

console.log("All Events ", allEvents);
  return (
    <div className="scheduled-events-dashboard bg-white px-5 pt-5 dark:border-gray-800 dark:text-gray-200 dark:bg-white/[0.02] ">
      <h1>Scheduled Events Dashboard</h1>

      {/* Table displaying all events with User Management style and pagination */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.02] sm:px-6 sm:pt-6">
        <h2 className="text-lg font-semibold mb-4">All Scheduled Events</h2>
        <div className="max-w-full overflow-x-auto p-2">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead>
              <tr>
                <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 flex items-center gap-5" title="Download Scheduled Events as PDF">
                  Event Name
                  <LightPdfIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" aria-label="PDF Icon" onClick={handleClick }/>
                </th>
                
                <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Location</th>
                <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Scheduled Date/Time</th>                
                <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {currentEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-gray-500 dark:text-gray-400">No scheduled events found on this page.</td>
                </tr>
              ) : (
                currentEvents.map(event => (
                  <tr
                    key={event._id}
                    onClick={() => handleRowClick(event)}
                    className={`cursor-pointer ${selectedEvent?._id === event._id ? 'bg-blue-100 dark:bg-blue-900' : ''}`} // Added selected row styling
                  >
                    {/* <td className="py-3 text-gray-800 dark:text-white/90">{event.eventDetails.summary}</td><td className="py-3 text-gray-500 dark:text-gray-400">{format(new Date(event.eventDetails.startTime), 'yyyy-MM-dd hh:mm a')}</td><td className="py-3 text-gray-500 dark:text-gray-400">{format(new Date(event.eventDetails.endTime), 'yyyy-MM-dd hh:mm a')}</td><td className="py-3 text-gray-500 dark:text-gray-400">{format(new Date(event.scheduledTime), 'yyyy-MM-dd hh:mm a')}</td><td className="py-3 text-gray-500 dark:text-gray-400">{format(new Date(event.createdAt), 'yyyy-MM-dd hh:mm a')}</td><td className="py-3 text-gray-800 dark:text-white/90">{event.status}</td> */}
                    <td className="py-3 text-gray-800 dark:text-white/90">{event.eventDetails.summary}</td>                    
                    <td className="py-3 text-gray-800 dark:text-white/90">{event.eventDetails.location}</td>                      
                    <td className="py-3 text-gray-500 dark:text-gray-400">{format(new Date(event.eventDetails.scheduledTime), 'yyyy-MM-dd hh:mm a')}</td>                    
                    <td className="py-3 text-gray-800 dark:text-white/90">{event.status}</td>                     
                      
                      
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls mt-4 flex justify-center items-center space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-800 dark:text-white/90">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>


      {/* Table displaying emailed users for the selected event with User Management style */}
      {selectedEvent ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 mt-6"> {/* Added mt-6 for spacing */}
          <h3 className="text-lg font-semibold mb-4">Emailed Users for Selected Event: {selectedEvent.eventDetails.summary}</h3>
          <div className="max-w-full overflow-x-auto p-2">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead>
                <tr>
                  <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-1/3">User Name</th>
                  {/* <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Last Name</th> */}
                  <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-1/3">Email</th>
                  <th className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-1/3">Email Sent Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {selectedEvent.selectedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-3 text-center text-gray-500 dark:text-gray-400">No users were emailed for this event.</td>
                  </tr>
                ) : (
                  selectedEvent.selectedUsers.map((user, index) => (
                    <tr key={index}>
                      {/* Display first and last name if available, otherwise use the 'name' field */}
                      <td className="py-3 text-gray-800 dark:text-white/90 w-1/3">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name }
                      </td>
                      {/* <td className="py-3 text-gray-800 dark:text-white/90">{user.lastName || '-'}</td> Keep last name column for consistency, though it might be redundant if using full name from 'name' */}
                      <td className="py-3 text-gray-500 dark:text-gray-400 w-1/3">{user.email}</td>
                      {/* <td className="py-3 text-gray-500 dark:text-gray-400 w-1/3">{format(new Date(selectedEvent.createdAt), 'yyyy-MM-dd hh:mm a')}</td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Select an event from the table above to see emailed users.</p>
      )}

      {/* iCal Template Information Section */}
      <div className="ical-information-section mt-6"> {/* Added mt-6 for spacing */}
        <h3 className="text-lg font-semibold mb-4">iCal Template Information</h3>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
          <p className="text-gray-800 dark:text-white/90">The iCal content for this event is generated dynamically based on the event details.</p>
          {/* You could add more details here if a specific template name or description was stored */}
        </div>
      </div>
    </div>
  );
};

export default ScheduledEventsPage;
