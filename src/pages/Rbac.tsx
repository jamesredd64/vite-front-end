import React, { useState, useEffect } from 'react';

import { useUserProfile } from '../hooks/useUserProfile';
import useRbac from '../hooks/useRbac';
import UserUpdateModal from '../components/UserUpdateModal'; // Import the new modal component

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State for the user being edited

  const { profile } = useUserProfile();
  const userRole = profile?.role || 'guest';
  const { canAccess, loading: rbacLoading } = useRbac(userRole);

  useEffect(() => {
    // In a real application, you would fetch users from an API here.
    // For this example, we'll use dummy data.
    const fetchUsers = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dummyUsers: User[] = [
          { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'showcase_attendee' },
          { id: '2', name: 'Bob Johnson', email: 'bob@example.com', role: 'showcase_admin' },
          { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'showcase_attendee' },
        ];
        setUsers(dummyUsers);
      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userRole]); // Added userRole dependency

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null); // Clear selected user when modal is closed
  };

  const handleSaveUser = (updatedUser: User) => {
    // In a real application, you would send updatedUser to your backend API
    console.log('Saving user:', updatedUser);
    // Update the users list in the state (optional, depending on your data flow)
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    handleCloseModal(); // Close modal after saving
  };


  if (loading || rbacLoading) { // Combined loading states
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                {/* Add action buttons here */}
                {canAccess('dashboard', 'read') && (
                  <button
                    type="button"
                    className="text-blue-500 hover:underline mr-2"
                    onClick={() => handleViewDetails(user)} // Call handler on click
                  >
                    View
                  </button>
                )}
                {canAccess('dashboard', 'write') && (
                  <button className="text-yellow-500 hover:underline mr-2">Edit</button>
                )}
                {canAccess('dashboard', 'delete') && (
                  <button className="text-red-500 hover:underline">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* User Update Modal */}
      <UserUpdateModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;
