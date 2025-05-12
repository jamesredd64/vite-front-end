import React, { useState } from 'react';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { UserIcon, MailIcon, CalenderIcon } from '../icons';
import Checkbox from '../components/form/input/Checkbox';
import type { AdminSettings, RoleBasedAccess, RolePermissions, RbacAppTypePermissions, AccessFunction } from '../types/rbac.types';

export const initialSettings: AdminSettings = {
  roleBasedAccess: [
    {
      role: 'admin',
      permissions: {
        dashboard: { // rbac app type
          read: { access: true }, // access function
          write: { access: true },
          delete: { access: false },
        },
        users: { // rbac app type
          read: { access: true }, // access function
          write: { access: true },
          delete: { access: true },
        },
        settings: { // rbac app type
          read: { access: true }, // access function
          write: { access: true },
          delete: { access: true },
        },
        // Add other rbac app types and access functions as needed
      },
      // features might need to be re-evaluated or removed depending on how granular permissions are used
      features: ['dashboard', 'users', 'settings'],
    },
    {
      role: 'user',
      permissions: {
        dashboard: { // rbac app type
          read: { access: true }, // access function
          write: { access: false },
          delete: { access: false },
        },
        // Add other rbac app types and access functions as needed
      },
      features: ['dashboard'],
    },
  ],
  emailTemplates: {
    invitation: 'Welcome to our platform! Click here to get started: {{inviteLink}}',
    reminder: "Don't forget about your upcoming event: {{eventDetails}}",
    welcome: "Thanks for joining! Here's what you need to know: {{welcomeInfo}}",
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
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);

  // Handlers for role permissions toggles
  // Handlers for role permissions toggles
  const handlePermissionChange = (roleIndex: number, appTypeKey: string, accessFunctionKey: string) => {
    const updatedSettings = { ...settings };
    const currentValue = updatedSettings.roleBasedAccess[roleIndex].permissions[appTypeKey][accessFunctionKey].access;
    updatedSettings.roleBasedAccess[roleIndex].permissions[appTypeKey][accessFunctionKey].access = !currentValue;
    setSettings(updatedSettings);
  };

  // Handlers for email template changes
  const handleEmailTemplateChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        [key]: value,
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
          ...prev.security.passwordPolicy,
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
          ...prev.calendar.workingHours,
          [key]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    // TODO: Implement save logic (e.g., API call)
    alert('Settings saved (functionality to be implemented)');
  };

  return (
    <>
      <PageMeta title="Admin Settings | TailAdmin" description="Manage admin settings" />
      <PageBreadcrumb pageTitle="Admin Settings" />

      <div className="space-y-8">
        {/* Role Based Access Section */}
        <section className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2 mb-4">
            <UserIcon className="size-5" />
            Role Based Access
          </h2>
          {settings.roleBasedAccess.map((roleAccess: RoleBasedAccess, roleIndex: number) => (
            <div key={roleAccess.role} className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 dark:text-white/80 mb-2">{roleAccess.role}</h3>
              <div className="space-y-4">
                {Object.entries(roleAccess.permissions as RolePermissions).map(([appTypeKey, accessFunctions]: [string, RbacAppTypePermissions]) => (
                  <div key={appTypeKey} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-2 capitalize">{appTypeKey}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-800 dark:text-white">
                      {Object.entries(accessFunctions).map(([accessFunctionKey, access]: [string, AccessFunction]) => (
                        <div key={accessFunctionKey} className="flex items-center gap-1">
                          <Checkbox
                            id={`permission-${roleAccess.role}-${appTypeKey}-${accessFunctionKey}`}
                            checked={access.access}
                            onChange={() => handlePermissionChange(roleIndex, appTypeKey, accessFunctionKey)}
                          />
                          <label
                            htmlFor={`permission-${roleAccess.role}-${appTypeKey}-${accessFunctionKey}`}
                            className="text-sm capitalize text-gray-800 dark:text-white select-none cursor-pointer"
                          >
                            {accessFunctionKey.replace(/([A-Z])/g, ' $1').trim()} {/* Basic formatting for display */}
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
          {Object.entries(settings.emailTemplates).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="block text-gray-700 dark:text-white/90 font-semibold mb-1 capitalize" htmlFor={key}>
                {key} Template
              </label>
              <textarea
                id={key}
                value={value}
                onChange={(e) => handleEmailTemplateChange(key, e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white/90 bg-white dark:bg-gray-900"
              />
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
                value={settings.security.sessionTimeout}
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
                value={settings.security.maxLoginAttempts}
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
                value={settings.security.passwordPolicy.minLength}
                onChange={(e) => handlePasswordPolicyChange('minLength', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white/90 bg-white dark:bg-gray-900"
                min={1}
              />
            </div>
            {['requireSpecialChar', 'requireNumber', 'requireUppercase'].map((key) => (
              <div key={key} className="flex items-center gap-2"> {/* Keep the wrapper div */}
                <Checkbox
                  id={key}
                  // Remove label prop to suppress internal label
                  checked={settings.security.passwordPolicy[key]}
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
                checked={settings.calendar.showAllEvents}
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
              value={settings.calendar.defaultView}
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
                value={settings.calendar.workingHours.start}
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
                value={settings.calendar.workingHours.end}
                onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white/90 bg-white dark:bg-gray-900"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
