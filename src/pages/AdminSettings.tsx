import React, { useState, useEffect } from 'react';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { UserIcon, MailIcon, CalenderIcon } from '../icons';
import Checkbox from '../components/form/input/Checkbox';
import type { AdminSettings, RoleBasedAccess, RolePermissions, RbacAppTypePermissions, AccessFunction } from '../types/rbac.types';
import { useAdminService } from '../services/adminService';
import { useAuth0 } from '@auth0/auth0-react';
import Alert from '../components/ui/alert/Alert';

// Define initialSettings with the correct structure matching AdminSettings type
export const initialSettings: AdminSettings = {
  roleBasedAccess: [
    {
      role: 'admin',
      permissions: {
        dashboard: { read: { access: true }, write: { access: true }, delete: { access: false } },
        users: { read: { access: true }, write: { access: true }, delete: { access: true } },
        settings: { read: { access: true }, write: { access: true }, delete: { access: true } },
      },
      features: ['dashboard', 'users', 'settings'],
    },
    {
      role: 'user',
      permissions: {
        dashboard: { read: { access: true }, write: { access: false }, delete: { access: false } },
      },
      features: ['dashboard'],
    },
  ],
  emailTemplates: {
    invitation: { subject: 'Event Invitation', body: 'Welcome to our platform! Click here to get started: {{inviteLink}}' },
    reminder: { subject: "Event Reminder", body: "Don't forget about your upcoming event: {{eventDetails}}" },
    welcome: { subject: "Welcome to the Platform!", body: "Thanks for joining! Here's what you need to know: {{welcomeInfo}}" },
  },
  security: {
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireSpecialChar: true,
      requireNumber: true,
      requireUppercase: true,
    },
  },
  calendar: {
    showAllEvents: false,
    defaultView: 'week',
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
  },
};

const AdminSettings: React.FC = () => {
  const { getAdminSettings, overwriteAllAdminSettings } = useAdminService();
  const { getAccessTokenSilently } = useAuth0();
  const [settings, setSettings] = useState<AdminSettings>({} as AdminSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  


  // Effect to clear status message after a few seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (statusMessage) {
      timeoutId = setTimeout(() => {
        setStatusMessage(null);
      }, 5000); // 5 seconds
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [statusMessage]);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await getAdminSettings();
        console.log('Fetched Settings:', response.data);
        setSettings(response.data);
      } catch (err: any) {
        console.error('Error fetching admin settings:', err);
        setError(err.message || 'Failed to fetch admin settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

    // Auto-clear status messages
    useEffect(() => {
      if (!statusMessage) return;
      const timeoutId = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timeoutId);
    }, [statusMessage]);

  // Handlers for role permissions toggles
  const handlePermissionChange = (roleIndex: number, appTypeKey: string, accessFunctionKey: string) => {
    const updatedSettings = { ...settings };
    // Add checks for nested properties before accessing
    const currentValue = updatedSettings.roleBasedAccess?.[roleIndex]?.permissions?.[appTypeKey]?.[accessFunctionKey]?.access;
    if (updatedSettings.roleBasedAccess?.[roleIndex]?.permissions?.[appTypeKey]?.[accessFunctionKey]) {
      updatedSettings.roleBasedAccess[roleIndex].permissions[appTypeKey][accessFunctionKey].access = !currentValue;
      setSettings(updatedSettings);
    }
  };

  // Handlers for email template changes
  const handleEmailTemplateChange = (key: string, field: 'subject' | 'body', value: string) => {
    setSettings((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        [key]: {
          ...prev.emailTemplates?.[key], // Add optional chaining
          [field]: value,
        },
      },
    }));
  };

  // Handlers for security settings changes
  const handleSecurityChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }));
  };

  // Handlers for password policy changes
  const handlePasswordPolicyChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        passwordPolicy: {
          ...prev.security?.passwordPolicy, // Add optional chaining
          [key]: value,
        },
      },
    }));
  };

  // Handlers for calendar settings changes
  const handleCalendarChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        [key]: value,
      },
    }));
  };

  // Handlers for calendar working hours changes
  const handleWorkingHoursChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        workingHours: {
          ...prev.calendar?.workingHours, // Add optional chaining
          [key]: value,
        },
      },
    }));
  };

  // Save settings handler
  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const response = await overwriteAllAdminSettings(settings);
      console.log('Save response:', response);

      if (response.success) {
        setStatusMessage({
          type: 'success',
          title: 'Success',
          message: 'Settings saved successfully!',
        });
      } else {
        setStatusMessage({
          type: 'error',
          title: 'Error',
          message: response.message || 'Failed to save settings.',
        });
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setStatusMessage({
        type: 'error',
        title: 'Error',
        message: err.message || 'Unexpected error occurred while saving.',
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <>
      <PageMeta title="Admin Settings | TailAdmin" description="Manage admin settings" />
      <PageBreadcrumb pageTitle="Admin Settings" />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-700 dark:text-white/90">Loading settings...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <Alert variant="error" title="Error" message={error} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Role Based Access Section */}
          <section className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2 mb-4">
              <UserIcon className="size-5" />
              Role Based Access
            </h2>
            {settings.roleBasedAccess?.map((roleAccess: RoleBasedAccess, roleIndex: number) => (
              <div key={roleAccess.role} className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 dark:text-white/80 mb-2">{roleAccess.role}</h3>
                <div className="space-y-4">
                  {Object.entries(roleAccess.permissions as RolePermissions || {})?.map(([appTypeKey, accessFunctions]: [string, RbacAppTypePermissions]) => (
                    <div key={appTypeKey} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-2 capitalize">{appTypeKey}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-800 dark:text-white">
                        {Object.entries(accessFunctions || {})?.map(([accessFunctionKey, access]: [string, AccessFunction]) => (
                          <div key={accessFunctionKey} className="flex items-center gap-1">
                            <Checkbox
                              id={`permission-${roleAccess.role}-${appTypeKey}-${accessFunctionKey}`}
                              checked={access?.access || false}
                              onChange={() => handlePermissionChange(roleIndex, appTypeKey, accessFunctionKey)}
                            />
                            <label
                              htmlFor={`permission-${roleAccess.role}-${appTypeKey}-${accessFunctionKey}`}
                              className="text-sm capitalize text-gray-800 dark:text-white select-none cursor-pointer"
                            >
                              {accessFunctionKey.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Email Templates Section */}
          <section className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2 mb-4">
              <MailIcon className="size-5" />
              Email Templates
            </h2>
            {settings.emailTemplates && Object.entries(settings.emailTemplates)?.map(([key, template]) => (
              <div key={key} className="mb-4 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-700 dark:text-white/90 mb-2 capitalize">{key} Template</h3>
                <div className="mb-3">
                  <label className="block text-gray-700 dark:text-white/90 font-semibold mb-1" htmlFor={`${key}-subject`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id={`${key}-subject`}
                    value={template?.subject || ''}
                    onChange={(e) => handleEmailTemplateChange(key, 'subject', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white/90 bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-white/90 font-semibold mb-1" htmlFor={`${key}-body`}>
                    Body
                  </label>
                  <textarea
                    id={`${key}-body`}
                    value={template?.body || ''}
                    onChange={(e) => handleEmailTemplateChange(key, 'body', e.target.value)}
                    rows={5}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:bg-gray-900"
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Security Section */}
          <section className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2 mb-4">
              {/* No CogIcon available, using UserIcon as placeholder */}
              <UserIcon className="size-5" />
              Security Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 dark:text-white/90 font-semibold mb-1" htmlFor="sessionTimeout">
                  Session Timeout (seconds)
                </label>
                <input
                  type="number"
                  id="sessionTimeout"
                  value={settings.security?.sessionTimeout || 0}
                  onChange={(e) => handleSecurityChange('sessionTimeout', Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white/90 bg-white dark:bg-gray-900"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-white/90 font-semibold mb-1" htmlFor="maxLoginAttempts">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  id="maxLoginAttempts"
                  value={settings.security?.maxLoginAttempts || 0}
                  onChange={(e) => handleSecurityChange('maxLoginAttempts', Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white/90 bg-white dark:bg-gray-900"
                  min={0}
                />
              </div>
            </div>

            <h3 className="text-md font-semibold text-gray-700 dark:text-white/90 mb-3">Password Policy</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-white/90 font-semibold mb-1" htmlFor="minLength">
                  Minimum Length
                </label>
                <input
                  type="number"
                  id="minLength"
                  value={settings.security?.passwordPolicy?.minLength || 0}
                  onChange={(e) => handlePasswordPolicyChange('minLength', Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white/90 bg-white dark:bg-gray-900"
                  min={1}
                />
              </div>
              {settings.security?.passwordPolicy && Object.entries(settings.security.passwordPolicy).filter(([key]) => ['requireSpecialChar', 'requireNumber', 'requireUppercase'].includes(key)).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2"> {/* Keep the wrapper div */}
                  <Checkbox
                    id={key}
                    // Remove label prop to suppress internal label
                    checked={value as boolean || false}
                    onChange={(checked) => handlePasswordPolicyChange(key, checked)}
                    // Custom Checkbox component handles its own styling
                  />
                  {/* Manual label with explicit dark mode styling */}
                  <label
                    htmlFor={key}
                    className="text-sm font-semibold select-none cursor-pointer text-gray-800 dark:text-white/90"
                  >
                    {key.replace('require', 'Require ')}
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Calendar Section */}
          <section className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2 mb-4">
              <CalenderIcon className="size-5" />
              Calendar Settings
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1"> {/* Wrap Checkbox and label */}
                <Checkbox
                  id="showAllEvents"
                  // Remove label prop to suppress internal label
                  checked={settings.calendar?.showAllEvents || false}
                  onChange={(checked) => handleCalendarChange('showAllEvents', checked)}
                  // Custom Checkbox component handles its own styling
                />
                {/* Manual label with explicit dark mode styling */}
                <label
                  htmlFor="showAllEvents"
                  className="text-gray-700 dark:text-white/90 font-semibold select-none cursor-pointer"
                >
                  Show All Events
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="defaultView" className="block text-gray-700 dark:text-white/90 font-semibold mb-1">
                Default View
              </label>
              <select
                id="defaultView"
                value={settings.calendar?.defaultView || ''}
                onChange={(e) => handleCalendarChange('defaultView', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white/90 bg-white dark:bg-gray-900"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="workingHoursStart" className="block text-gray-700 dark:text-white/90 font-semibold mb-1">
                  Working Hours Start
                </label>
                <input
                  type="time"
                  id="workingHoursStart"
                  value={settings.calendar?.workingHours?.start || ''}
                  onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white/90 bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <label htmlFor="workingHoursEnd" className="block text-gray-700 dark:text-white/90 font-semibold mb-1">
                  Working Hours End
                </label>
                <input
                  type="time"
                  id="workingHoursEnd"
                  value={settings.calendar?.workingHours?.end || ''}
                  onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white/90 bg-white dark:bg-gray-900"
                />
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            {statusMessage && (
              <div className="mr-4">
                <Alert variant={statusMessage.type} title={statusMessage.title} message={statusMessage.message} />
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving} // Disable button while saving
              className={`rounded-md px-6 py-2 text-white focus:outline-none focus:ring-2 ${
                isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSettings;
