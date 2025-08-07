 import React, { useState, useEffect } from 'react';
import UsersLookup from './UsersLookup';
import { EmailService } from '../services/email.service';
import { useAdminService } from '../services/adminService'; // Import adminService
import type User from '../types/user';
import type { AdminSettings, AdminSettingsResponse } from '../types/rbac.types'; // Import AdminSettings type
import Loader from '../components/common/Loader';
import { useAuth0 } from '@auth0/auth0-react';

const SendEmailPage: React.FC = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
   const { getAdminSettings, overwriteAllAdminSettings } = useAdminService();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Store only user IDs
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showUserLookup, setShowUserLookup] = useState(true); // State to control visibility

  const [useTemplate, setUseTemplate] = useState(false); // State for "Use Template" checkbox
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(''); // State for selected template key
  const [emailTemplates, setEmailTemplates] = useState<{ [key: string]: { subject: string, body: string } }>({}); // State for email templates
  const [loadingTemplates, setLoadingTemplates] = useState(true); // Add loading state
  const [templateError, setTemplateError] = useState<string | null>(null); // Add error state

  const availableTags = [
    "{{firstName}}",
    "{{lastName}}",
    "{{title}}",
    "{{email}}",
  ];

  // Monitor template state changes
  useEffect(() => {
    console.log('Current email templates state:', emailTemplates);
    console.log('Loading templates:', loadingTemplates);
  }, [emailTemplates, loadingTemplates]);

  // Fetch email templates on component mount
  useEffect(() => {
    const fetchEmailTemplates = async () => {
      try {
        setLoadingTemplates(true);
        // const response = await useAdminService.getAdminSettings(getAccessTokenSilently);
        const response = await getAdminSettings();
        console.log('Fetched admin settings response:', response);

        if (!response?.success) {
          throw new Error('Failed to fetch admin settings');
        }

        const settings = response.data || {};
        console.log('Extracted settings:', settings);

        // Ensure we have valid templates
        const validTemplates = settings?.emailTemplates || {};
        console.log('Extracted email templates:', validTemplates);

        // Update state
        setEmailTemplates(validTemplates);
        setSelectedTemplateKey('');
        // Removed clearing subject and body here to prevent controlled input warning
        setTemplateError(null);
      } catch (error) {
        console.error('Error fetching email templates:', error);
        setTemplateError('Failed to load email templates');
      } finally {
        setLoadingTemplates(false);
      }
    };

    if (isAuthenticated) {
      fetchEmailTemplates();
    }
  }, [isAuthenticated, getAccessTokenSilently]); // Update dependency array

  // useEffect(() => {
  //   if (useTemplate && selectedTemplateKey) {
  //     console.log('Fetching template for:', selectedTemplateKey);
  
  //     const template = emailTemplates[selectedTemplateKey];
  
  //     if (template) {
  //       console.log('Applying template xxxx:', template);
  //       setSubject(template.subject);
  //       setBody(template.body);
  //     } else {
  //       console.warn('Template not found for key:', selectedTemplateKey);
  //     }
  //   }
  // }, [useTemplate, selectedTemplateKey, emailTemplates]); 
  
  // useEffect(() => {
  //   console.log('Rendered subject:', subject);
  //   console.log('Rendered body:', body);
  // }, [subject, body]);

  
  // useEffect(() => {
  //   console.log('Email templates fetched:', emailTemplates);
  // }, [emailTemplates]);
  
  // useEffect(() => {
  //   console.log('Final subject after template selection:', subject);
  //   console.log('Final body after template selection:', body);
  // }, [subject, body]);

  
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
    console.log('Use Template checkbox changed to:', checked);
    setUseTemplate(checked);
    if (!checked) {
      // Clear selected template, subject, and body if checkbox is unchecked
      setSelectedTemplateKey('');
      setSubject(''); // Clear subject
      setBody('');
    }
    // The useEffect hook will handle applying the template if checked
  };

  // const handleTemplateSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const key = e.target.value;
  //   setSelectedTemplateKey(key);
  
  //   setTimeout(() => {
  //     const selectedTemplate = emailTemplates[key];
  
  //     if (selectedTemplate) {
  //       if (allUsers.length > 0) {
  //         const firstUser = allUsers[0]; // Use first user for preview
  //         setSubject(replaceMergeFields(selectedTemplate.subject, firstUser));
  //         setBody(replaceMergeFields(selectedTemplate.body, firstUser));
  //       } else {
  //         setSubject(selectedTemplate.subject);
  //         setBody(selectedTemplate.body);
  //       }
  //     }
  //   }, 0);
  // };

  
  // const handleTemplateSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const key = e.target.value;
  //   console.log('Template selected:', key);
  //   setSelectedTemplateKey(key);

  //   setTimeout(() => {
  //     const selectedTemplate = emailTemplates[key];
  //     console.log('Retrieved template:', selectedTemplate);

  //     if (selectedTemplate) {
  //       if (allUsers.length > 0) {
  //         const firstUser = allUsers[0]; // Use the first user to preview merge fields
  //         const processedSubject = replaceMergeFields(selectedTemplate.subject, firstUser);
  //         const processedBody = replaceMergeFields(selectedTemplate.body, firstUser);

  //         setSubject(processedSubject);
  //         setBody(processedBody);
  //         console.log('Updated Subject:', processedSubject);
  //         console.log('Updated Body:', processedBody);
  //       } else {
  //         setSubject(selectedTemplate.subject);
  //         setBody(selectedTemplate.body);
  //       }
  //     } else {
  //       console.warn('No template found for key:', key);
  //     }
  //   }, 0);
  // };
  
  
  
  

  // const handleTemplateSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const key = e.target.value;
  //   console.log('Template selected zzzz:', key);
  //   setSelectedTemplateKey(key);
  
  //   setTimeout(() => {
  //     const selectedTemplate = emailTemplates[key]; // Store the selected template locally
  //     console.log('Retrieved template:', selectedTemplate);
  
  //     if (selectedTemplate) {
  //       setSubject(selectedTemplate.subject);
  //       setBody(selectedTemplate.body);
  //       console.log('Updated Subject---:', selectedTemplate.subject);
  //       console.log('Updated Body----:', selectedTemplate.body);
  //     } else {
  //       console.warn('No template found for key:', key);
  //     }
  //   }, 0); // Ensures React processes the state update
  // };
  
  const handleTemplateSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedTemplateKey(key);
  
    setTimeout(() => {
      const selectedTemplate = emailTemplates[key];
  
      if (selectedTemplate) {
        if (allUsers.length > 0) {
          const firstUser = allUsers[0]; // Preview using first user
          setSubject(replaceMergeFields(selectedTemplate.subject, firstUser));
          setBody(replaceMergeFields(selectedTemplate.body, firstUser));
        } else {
          setSubject(selectedTemplate.subject);
          setBody(selectedTemplate.body);
        }
      }
    }, 0);
  };
  
  const generateResponsiveEmail = (body: string) => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; }
            @media screen and (max-width: 480px) {
              body { width: 100% !important; padding: 10px; }
            }
          </style>
        </head>
        <body class="email-container">
          ${body}
        </body>
      </html>
    `;
  };   
  
  // Helper function to safely access nested properties
  // const getNestedValue = (obj: any, path: string): any => {
  //   return path.split('.').reduce((acc, part) => {
  //     if (acc && typeof acc === 'object' && part in acc) {
  //       return acc[part];
  //     }
  //     return undefined;
  //   }, obj);
  // };

  const replaceMergeFields = (template: string, user: User): string => {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
      const value = getNestedValue(user, key);
      return value !== undefined ? value.toString() : `{{${key}}}`; // Preserve if not found
    });
  };
  
  // Helper function to access nested values like profile.firstName
  const getNestedValue = (obj: any, key: string) => {
    return key.split('.').reduce((acc, part) => acc?.[part], obj);
  };
  
  
  // const replaceMergeFields = (template: string, user: User): string => {
  //   return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
  //     const value = key.split('.').reduce((acc: any, part) => acc && acc[part] !== undefined ? acc[part] : null, user);
  //     return value !== null ? value.toString() : `{{${key}}}`; // Preserve if missing
  //   });
  // };
  
  
  
  

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
      // Process subject and body replacements for each user
      const emails = allUsers.map(user => {
      //   const processedSubject = replaceMergeFields(subject, user);
      //   const processedBody = generateResponsiveEmail(replaceMergeFields(body, user));
  
        return {
          email: user.email,
          subject: subject,
          body: body
        };
      });
  
      // Extract only email addresses & correctly formatted email bodies
      const emailAddresses = emails.map(email => email.email);
      const emailBody = body;
  
      console.log('Processed Subjects:', emails.map(e => e.subject));
      console.log('Processed Bodies:', emailBody);
  
      // Send emails (now correctly passing formatted subject & body)
      await EmailService.sendBulkEmails(emailAddresses, subject, emailBody);
  
      setMessage('Emails sent successfully!');
      setSelectedUsers([]);
      setAllUsers([]);
      setSubject('');
      setBody('');
      setUseTemplate(false);
      setSelectedTemplateKey('');
    } catch (error: any) {
      setMessage(`Failed to send emails: ${error.message || 'Unknown error'}`);
      console.error('Error sending emails:', error);
    } finally {
      setIsSending(false);
    }
  };
 
  // const handleSendEmail = async () => {
  //   if (selectedUsers.length === 0) {
  //     setMessage('Please select at least one user.');
  //     return;
  //   }
  //   if (!subject || !body) {
  //     setMessage('Please enter both subject and body.');
  //     return;
  //   }

  //   setIsSending(true);
  //   setMessage(null);

  //   try {
  //     const recipientEmails = allUsers.map(user => user.email);
  //     await EmailService.sendBulkEmails(recipientEmails, subject, body);

  //     setMessage('Emails sent successfully!');
  //     setSelectedUsers([]);
  //     setAllUsers([]);
  //     setSubject('');
  //     setBody('');
  //     setUseTemplate(false); // Reset template selection
  //     setSelectedTemplateKey('');
  //   } catch (error: any) {
  //     setMessage(`Failed to send emails: ${error.message || 'Unknown error'}`);
  //     console.error('Error sending emails:', error);
  //   } finally {
  //     setIsSending(false);
  //   }
  // };

  return (
    <div className="send-email-page bg-white px-5 pt-5 dark:border-gray-800 dark:text-gray-200 dark:bg-white/[0.02]">
      <div>
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
              <div>
                {loadingTemplates ? (
                  <div>Loading templates...</div>
                ) : templateError ? (
                  <div className="text-red-500">{templateError}</div>
                ) : (
                  <select
                    value={selectedTemplateKey}
                    onChange={handleTemplateSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={Object.keys(emailTemplates).length === 0} // Disable if no templates
                  >
                    <option value="">Select a template</option>
                    {Object.keys(emailTemplates).map(key => (
                      <option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject || ''} // Add fallback to empty string
            onChange={(e) => setSubject(e.target.value)}
            // readOnly={useTemplate} 
            className="mt-1 block w-full rounded-md p-4 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            // disabled={useTemplate} // Make subject input disabled if using template
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Body
          </label>
          <textarea
            id="body"
            rows={10}
            value={body || ''} // Add fallback to empty string
            onChange={(e) => setBody(e.target.value)}
            // readOnly={useTemplate} // Field is readonly but can be updated programmatically
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            // disabled={useTemplate} // Make textarea disabled if using template
          ></textarea>
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
    </div>
  );
};

export default SendEmailPage;
