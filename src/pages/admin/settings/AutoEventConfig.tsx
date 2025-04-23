import React, { useState } from 'react';
import { AutoEventSettings } from '../../../types/settings';

interface Props {
  settings?: AutoEventSettings;
  onSave: (settings: AutoEventSettings) => void;
}

const AutoEventConfig: React.FC<Props> = ({ settings, onSave }) => {
  const [config, setConfig] = useState<AutoEventSettings>(settings || {
    scheduleFrequency: {
      morning: '0 9 * * *',
      afternoon: '0 15 * * *'
    },
    userCriteria: {
      status: ['active'],
      roles: ['user'],
      daysFromSignup: 30
    },
    eventDefaults: {
      reminderBefore: 60,
      autoExpire: true,
      expiryDays: 7
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Schedule Configuration</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Morning Schedule (Cron)
            </label>
            <input
              type="text"
              value={config.scheduleFrequency.morning}
              onChange={(e) => setConfig({
                ...config,
                scheduleFrequency: {
                  ...config.scheduleFrequency,
                  morning: e.target.value
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Afternoon Schedule (Cron)
            </label>
            <input
              type="text"
              value={config.scheduleFrequency.afternoon}
              onChange={(e) => setConfig({
                ...config,
                scheduleFrequency: {
                  ...config.scheduleFrequency,
                  afternoon: e.target.value
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">User Criteria</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User Status
            </label>
            <select
              multiple
              value={config.userCriteria.status}
              onChange={(e) => setConfig({
                ...config,
                userCriteria: {
                  ...config.userCriteria,
                  status: Array.from(e.target.selectedOptions, option => option.value)
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          {/* Add more criteria fields */}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default AutoEventConfig;