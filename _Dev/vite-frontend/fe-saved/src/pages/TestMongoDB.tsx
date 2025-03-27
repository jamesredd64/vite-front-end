import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '../services/api.service';
import { useState, useEffect } from 'react';
import React from 'react';

const TestMongoDB = () => {
  const { user } = useAuth0();
  const api = useApi();  // Updated this line
  const [status, setStatus] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkServerHealth();
    loadUsers();
  }, []);

  const checkServerHealth = async () => {
    try {
      const health = await api.checkHealth();
      setStatus(`Server Status: ${health.status}`);
    } catch (err) {
      setError('Server health check failed');
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await api.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const handleSaveUser = async () => {
    if (!user?.email) {
      setError('No user email found');
      return;
    }

    try {
      setStatus('Saving user data...');
      
      const userData = {
        email: user.email,
        firstName: user.given_name || 'Test',
        lastName: user.family_name || 'User',
        phoneNumber: '',
        profile: {
          profilePictureUrl: user.picture,
          marketingBudget: {
            amount: 1000,
            frequency: 'monthly' as const,
            adCosts: 500
          }
        }
      };

      await api.updateUserByEmail(user.email, userData);
      setStatus('User saved successfully!');
      await loadUsers(); // Reload the users list
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">MongoDB Connection Test</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">{status}</p>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="mb-4">
        <button 
          onClick={handleSaveUser}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Current User
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Saved Users:</h3>
        <div className="space-y-2">
          {users.map((user, index) => (
            <div key={index} className="border p-2 rounded">
              <p>Email: {user.email}</p>
              <p>Name: {user.firstName} {user.lastName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestMongoDB;