import React, { useState, useEffect } from 'react';
import UsersLookup from './UsersLookup';
import { EmailService } from '../services/email.service';
// import { adminService } from '../services/adminService';
import { useAdminService } from '../services/adminService';
import type User from '../types/user';
import type { AdminSettings } from '../types/rbac.types';
import Loader from '../components/common/Loader';
import { useAuth0 } from '@auth0/auth0-react';
import { MailIcon } from '../icons';
import Alert from '../components/ui/alert/Alert';

const availableTags = [
  "{{firstName}}",
  "{{lastName}}",
  "{{title}}",
  "{{email}}",
];

const SettingsAdmin: React.FC = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const { getAdminSettings, overwriteAllAdminSettings } = useAdminService();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; title: string; message: string } | null>(null);
  const [focusedTemplateKey, setFocusedTemplateKey] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<'subject' | 'body' | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await getAdminSettings();
        console.log("Fetched settings:", response.data);
        setSettings(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch admin settings');
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchSettings();
    }
  }, [isAuthenticated, isLoading]);

  // SetStatusMessage
  React.useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 5000); // Message disappears after 5 seconds
  
      return () => clearTimeout(timer); // Cleanup to prevent memory leaks
    }
  }, [statusMessage]);
  
  // Handle email template field focus
  const handleFocus = (key: string, field: 'subject' | 'body') => {
    setFocusedTemplateKey(key);
    setFocusedField(field);

    const element = document.getElementById(`${key}-${field}`) as HTMLInputElement | HTMLTextAreaElement;
    if (element) {
      setCursorPosition(element.selectionStart || 0);
    }
  };

  // Handle email template update
  const handleEmailTemplateChange = (key: string, field: 'subject' | 'body', value: string) => {
    setSettings(prevSettings => {
      if (!prevSettings || !prevSettings.emailTemplates) return prevSettings;
      return {
        ...prevSettings,
        emailTemplates: {
          ...prevSettings.emailTemplates,
          [key]: {
            ...prevSettings.emailTemplates[key],
            [field]: value
          }
        }
      };
    });
  };

  // Insert tag into active field
  const insertTagInField = (tag: string) => {
    if (!focusedTemplateKey || !focusedField) return;

    setSettings(prevSettings => {
      if (!prevSettings || !prevSettings.emailTemplates) return prevSettings;

      const currentValue = prevSettings.emailTemplates[focusedTemplateKey]?.[focusedField] || '';
      const newValue = `${currentValue} ${tag}`;

      return {
        ...prevSettings,
        emailTemplates: {
          ...prevSettings.emailTemplates,
          [focusedTemplateKey]: {
            ...prevSettings.emailTemplates[focusedTemplateKey],
            [focusedField]: newValue.trim(),
          },
        },
      };
    });
  };

  // Handle saving settings
  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const response = await overwriteAllAdminSettings(settings);
      setStatusMessage(response.success
        ? { type: 'success', title: 'Success', message: 'Settings saved successfully!' }
        : { type: 'error', title: 'Error', message: response.message || 'Failed to save settings.' }
      );
    } catch (error) {
      setStatusMessage({ type: 'error', title: 'Error', message: error instanceof Error ? error.message : 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!settings || !settings.emailTemplates) return <div>Loading email templates...</div>;

  return (
    <>
      <div className="settings-page bg-gray-100 dark:bg-gray-900 px-5 pt-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Send Email to Users</h1>

        {/* Email Templates Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white flex items-center gap-2 mb-4">
            <MailIcon className="size-5" /> Email Templates
          </h2>
          
          {Object.entries(settings.emailTemplates).map(([key, template]) => (
            <div key={key} className="mb-4 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-700 dark:text-white mb-2 capitalize">{key} Template</h3>

              <div className="mb-2 flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className="bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100 rounded-full px-3 py-1 text-xs font-semibold"
                    onClick={() => insertTagInField(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <label className="block text-gray-700 dark:text-white font-semibold mb-1" htmlFor={`${key}-subject`}>
                Subject
              </label>
              <input
                type="text"
                id={`${key}-subject`}
                onFocus={() => handleFocus(key, 'subject')}
                value={template.subject}
                onChange={(e) => handleEmailTemplateChange(key, 'subject', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white bg-white dark:bg-gray-900"
              />

              <label className="block text-gray-700 dark:text-white font-semibold mb-1" htmlFor={`${key}-body`}>
                Body
              </label>
              <textarea
                id={`${key}-body`}
                onFocus={() => handleFocus(key, 'body')}
                value={template.body}
                onChange={(e) => handleEmailTemplateChange(key, 'body', e.target.value)}
                rows={5}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white bg-white dark:bg-gray-900"
              />
            </div>
          ))}

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            {statusMessage && <Alert variant={statusMessage.type} title={statusMessage.title} message={statusMessage.message} />}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-36 rounded-md px-6 py-2 m-5 text-white focus:outline-none focus:ring-2 ${
                isSaving ? 'w-110 bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default SettingsAdmin;
