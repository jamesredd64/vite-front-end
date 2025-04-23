import React, { useState } from 'react';
import { AdminSettings } from '../../../types/settings';

interface Props {
  settings?: AdminSettings['security'];
  onSave: (settings: AdminSettings['security']) => void;
}

const SecuritySettings: React.FC<Props> = ({ settings, onSave }) => {
  const [security, setSecurity] = useState(settings || {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireSpecialChar: true,
      requireNumber: true,
      requireUppercase: true
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(security);
  };

  const handlePasswordPolicyChange = (key: keyof typeof security.passwordPolicy, value: boolean | number) => {
    setSecurity({
      ...security,
      passwordPolicy: {
        ...security.passwordPolicy,
        [key]: value
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Session Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({
                ...security,
                sessionTimeout: parseInt(e.target.value)
              })}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Login Attempts
            </label>
            <input
              type="number"
              value={security.maxLoginAttempts}
              onChange={(e) => setSecurity({
                ...security,
                maxLoginAttempts: parseInt(e.target.value)
              })}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Password Policy</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Password Length
            </label>
            <input
              type="number"
              value={security.passwordPolicy.minLength}
              onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value))}
              min="6"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={security.passwordPolicy.requireSpecialChar}
                onChange={(e) => handlePasswordPolicyChange('requireSpecialChar', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm"
              />
              <span className="ml-2">Require Special Character</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={security.passwordPolicy.requireNumber}
                onChange={(e) => handlePasswordPolicyChange('requireNumber', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm"
              />
              <span className="ml-2">Require Number</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={security.passwordPolicy.requireUppercase}
                onChange={(e) => handlePasswordPolicyChange('requireUppercase', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm"
              />
              <span className="ml-2">Require Uppercase Letter</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Security Settings
        </button>
      </div>
    </form>
  );
};

export default SecuritySettings;