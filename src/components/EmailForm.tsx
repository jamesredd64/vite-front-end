/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useEmailService } from '../services/emailService';
import { useAuth0 } from '@auth0/auth0-react';

export const EmailForm: React.FC = () => {
  const { sendEmail } = useEmailService();
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    console.log('Current user context:', {
      email: user?.email,
      isAuthenticated: !!user,
      auth0Id: user?.sub
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    console.log('Submitting email form:', {
      to: formData.to,
      subject: formData.subject,
      bodyLength: formData.body.length,
      currentUserEmail: user?.email
    });

    try {
      const emailData = {
        to: formData.to.split(',').map(email => email.trim()),
        subject: formData.subject,
        body: formData.body
      };

      console.log('Processed email data:', emailData);

      await sendEmail(emailData);

      console.log('Email sent successfully');
      setStatus({
        type: 'success',
        message: 'Email sent successfully!'
      });
      setFormData({ to: '', subject: '', body: '' });

    } catch (error) {
      console.error('Email submission error:', error);
      setStatus({
        type: 'error',
        message: 'Failed to send email. Please try again.'
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log('Form input change:', { field: name, value });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Send Email
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Logged in as: {user?.email}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To (separate multiple emails with commas)
            </label>
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300"
              rows={8}
              required
            />
          </div>

          {status.type && (
            <div className={`p-4 rounded ${
              status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {status.message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

