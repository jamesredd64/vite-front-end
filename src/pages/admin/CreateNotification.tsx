import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import Alert from '../../components/ui/alert/Alert';

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function CreateNotification() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'all',
    recipients: [] as string[]
  });

  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch users for selection when type is 'selected'
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (formData.type === 'selected') {
      fetchUsers();
    }
  }, [formData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await notificationService.createNotification(formData);
      setFormData({ title: '', message: '', type: 'all', recipients: [] });
      setStatus({
        type: 'success',
        message: 'Notification sent successfully!'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send notification. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Notification</h2>

      {status && (
        <div className="mb-6">
          <Alert
            variant={status.type}
            title={status.type === 'success' ? 'Success!' : 'Error!'}
            message={status.message}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipients
          </label>
          <select
            value={formData.type}
            onChange={(e) => {
              setFormData({
                ...formData,
                type: e.target.value as 'all' | 'selected',
                recipients: [] // Reset recipients when changing type
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="selected">Selected Users</option>
          </select>
        </div>

        {formData.type === 'selected' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Users
            </label>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
              {users.map((user) => (
                <label key={user._id} className="flex items-center p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.recipients.includes(user._id)}
                    onChange={(e) => {
                      const newRecipients = e.target.checked
                        ? [...formData.recipients, user._id]
                        : formData.recipients.filter(id => id !== user._id);
                      setFormData({ ...formData, recipients: newRecipients });
                    }}
                    className="mr-2"
                  />
                  <span>{user.name} ({user.email})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || (formData.type === 'selected' && formData.recipients.length === 0)}
            className={`
              px-4 py-2 rounded-md text-white font-medium
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </form>
    </div>
  );
}