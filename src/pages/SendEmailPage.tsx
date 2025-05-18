import React, { useState, useEffect } from 'react';
import UsersLookup from './UsersLookup';
import { EmailService } from '../services/email.service';
import { adminService } from '../services/adminService'; // Import adminService
import { useApi } from '../services/api.service'; // Import useApi hook
import type User from '../types/user';
import type { AdminSettings } from '../types/rbac.types'; // Import AdminSettings type
import Loader from '../components/common/Loader';
import { useAuth0 } from '@auth0/auth0-react';

const SendEmailPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const api = useApi(); // Call useApi hook here

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Store only user IDs
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showUserLookup, setShowUserLookup] = useState(true); // State to control visibility

  const [useTemplate, setUseTemplate] = useState(false); // State for "Use Template" checkbox
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(''); // State for selected template key
  const [emailTemplates, setEmailTemplates] = useState<AdminSettings['emailTemplates']>({}); // State for email templates

  // Fetch email templates on component mount
  useEffect(() => {
    const fetchEmailTemplates = async () => {
      try {
        // Pass fetchWithAuth to adminService.getAdminSettings
        const settings = await adminService.getAdminSettings(api.fetchWithAuth);
        setEmailTemplates(settings.emailTemplates || {});
      } catch (error) {
        console.error('Error fetching email templates:', error);
        // Optionally set an error message for the user
      }
    };

    if (isAuthenticated) {
      fetchEmailTemplates();
    }
  }, [isAuthenticated, api.fetchWithAuth]); // Add api.fetchWithAuth to dependency array

  const handleCloseLookup = () => {
    setShowUserLookup(false);
  };

  const handleUserSelection = (selectedUserIds: string[], users: User[]) => {
    console.log("Selected Users ", users);
    setSelectedUsers(selectedUserIds);
    // Hide the lookup after selection
    setShowUserLookup(false);
    // Filter the full list of users to get the details of the selected ones
    const selectedUserDetails = users.filter(user => selectedUserIds.includes(user.auth0Id));
    setAllUsers(selectedUserDetails.map(user => ({
      ...user,
      profile: {
        ...user.profile,
        status: user.isActive ? "active" : "inactive",
      },
    })));
  };

  const handleUseTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUseTemplate(checked);
    if (!checked) {
      // Clear selected template and body if checkbox is unchecked
      setSelectedTemplateKey('');
      setBody('');
    } else {
      // If checked, set body to the currently selected template if any
      if (selectedTemplateKey && emailTemplates[selectedTemplateKey]) {
        setBody(emailTemplates[selectedTemplateKey]);
      }
    }
  };

  const handleTemplateSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedTemplateKey(key);
    if (key && emailTemplates[key]) {
      setBody(emailTemplates[key]);
    } else {
      setBody(''); // Clear body if no template is selected
    }
  };

  const handleSendEmail = async () => {
    if (selectedUsers.length === 0) {
      setMessage('Please select at least one user.');
      return;
    }
    if (!subject || !body) {
      setMessage('Please enter both subject and body.');
      return;
    }

    setIsSending(true);
    setMessage(null);

    try {
      const recipientEmails = allUsers.map(user => user.email);
      await EmailService.sendBulkEmails(recipientEmails, subject, body);

      setMessage('Emails sent successfully!');
      setSelectedUsers([]);
      setAllUsers([]);
      setSubject('');
      setBody('');
      setUseTemplate(false); // Reset template selection
      setSelectedTemplateKey('');
    } catch (error: any) {
      setMessage(`Failed to send emails: ${error.message || 'Unknown error'}`);
      console.error('Error sending emails:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="send-email-page bg-white px-5 pt-5 dark:border-gray-800 dark:text-gray-200 dark:bg-white/[0.02]">
      <h1>Send Email to Users</h1>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Select Users</h2>
        {showUserLookup ? (
          /* Integrate UsersLookup directly */
          <UsersLookup
            isModal={true} // Render only the content part of UsersLookup
            onUserSelect={handleUserSelection}
            onClose={handleCloseLookup} // Pass the handler to close the lookup
            fetchOnLoad={false} // Prevent fetching users on load
            // Pass selectedUsers down to UsersLookup to maintain state if needed,
            // but UsersLookup manages its own selected state internally based on initial prop or user interaction.
            // Let's rely on UsersLookup's internal state for simplicity here.
          />
        ) : (
          <div className="mt-4">
            <strong>Selected Users:</strong>{' '}
            {allUsers.length > 0 && selectedUsers.length === allUsers.length ? (
              'All Users'
            ) : (
              `${allUsers.length}`
            )}
            {selectedUsers.length > 0 && selectedUsers.length !== allUsers.length && (
              <ul>
                {allUsers.map(user => (
                  <li key={user.auth0Id}>{user.firstName} {user.lastName} ({user.email})</li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowUserLookup(true)}
              className="px-4 py-2 bg-primary ml-5 text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              Select
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Email Content</h2>
        <div className="mb-4 flex items-center gap-4"> {/* Flex container for checkbox and dropdown */}
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={useTemplate}
              onChange={handleUseTemplateChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
            />
            Use Template
          </label>
          {useTemplate && (
            <select
              value={selectedTemplateKey}
              onChange={handleTemplateSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={Object.keys(emailTemplates).length === 0} // Disable if no templates
            >
              <option value="">Select a template</option>
              {Object.entries(emailTemplates).map(([key, value]) => (
                <option key={key} value={key}>
                  {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())} {/* Format key */}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full rounded-md p-4 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Body
          </label>
          <textarea
            id="body"
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={useTemplate} // Disable textarea if using template
          ></textarea>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSendEmail}
          disabled={isSending || selectedUsers.length === 0 || !subject || !body}
          className="px-4 py-2 border rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
        >
          {isSending ? 'Sending...' : 'Send Email'}
        </button>
        {message && (
          <p className={`mt-4 text-sm ${message.includes('successfully') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SendEmailPage;