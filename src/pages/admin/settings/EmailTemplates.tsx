import React, { useState } from 'react';
import { AdminSettings } from '../../../types/settings';

interface Props {
  settings?: AdminSettings['emailTemplates'];
  onSave: (settings: AdminSettings['emailTemplates']) => void;
}

const EmailTemplates: React.FC<Props> = ({ settings, onSave }) => {
  const [templates, setTemplates] = useState(settings || {
    invitation: '',
    reminder: '',
    welcome: ''
  });

  const templateDescriptions = {
    invitation: 'Sent when inviting new users to events',
    reminder: 'Sent as a reminder before scheduled events',
    welcome: 'Sent to new users upon registration'
  };

  const placeholders = {
    user: '{{userName}}',
    event: '{{eventName}}',
    date: '{{eventDate}}',
    time: '{{eventTime}}',
    location: '{{location}}',
    company: '{{companyName}}'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(templates);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Available Variables</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(placeholders).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-2 rounded">
              <code>{value}</code>
              <p className="text-sm text-gray-600">{key}</p>
            </div>
          ))}
        </div>
      </div>

      {Object.entries(templates).map(([key, value]) => (
        <div key={key} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-medium capitalize">{key} Template</h3>
            <p className="text-sm text-gray-600">
              {templateDescriptions[key as keyof typeof templateDescriptions]}
            </p>
          </div>

          <textarea
            value={value}
            onChange={(e) => setTemplates({
              ...templates,
              [key]: e.target.value
            })}
            rows={6}
            className="w-full p-2 border rounded-md"
            placeholder={`Enter ${key} template...`}
          />
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Templates
        </button>
      </div>
    </form>
  );
};

export default EmailTemplates;