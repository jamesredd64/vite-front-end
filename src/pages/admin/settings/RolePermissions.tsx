import React, { useState } from 'react';
import { RoleBasedAccess, RolePermission } from '../../../types/settings';

interface Props {
  settings?: RoleBasedAccess[];
  onSave: (settings: RoleBasedAccess[]) => void;
}

const RolePermissions: React.FC<Props> = ({ settings = [], onSave }) => {
  const [roles, setRoles] = useState<RoleBasedAccess[]>(settings);

  const defaultPermissions: RolePermission = {
    name: '',
    description: '',
    access: { read: false, write: false, delete: false }
  };

  const availableRoles = ['admin', 'user', 'manager', 'super-admin'] as const;
  const availableFeatures = [
    'dashboard',
    'users',
    'events',
    'reports',
    'settings',
    'marketing',
    'notifications'
  ];

  const handlePermissionChange = (
    roleIndex: number,
    permissionKey: string,
    accessType: keyof RolePermission['access'],
    value: boolean
  ) => {
    const newRoles = [...roles];
    newRoles[roleIndex].permissions[permissionKey].access[accessType] = value;
    setRoles(newRoles);
  };

  const handleFeatureToggle = (roleIndex: number, feature: string) => {
    const newRoles = [...roles];
    const features = newRoles[roleIndex].features;
    const featureIndex = features.indexOf(feature);
    
    if (featureIndex === -1) {
      features.push(feature);
    } else {
      features.splice(featureIndex, 1);
    }
    
    setRoles(newRoles);
  };

  const addNewRole = () => {
    setRoles([...roles, {
      role: 'user',
      permissions: {},
      features: []
    }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(roles);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Role Permissions</h2>
        <button
          type="button"
          onClick={addNewRole}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add Role
        </button>
      </div>

      {roles.map((role, roleIndex) => (
        <div key={roleIndex} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex justify-between items-center">
            <select
              value={role.role}
              onChange={(e) => {
                const newRoles = [...roles];
                newRoles[roleIndex].role = e.target.value as RoleBasedAccess['role'];
                setRoles(newRoles);
              }}
              className="rounded-md border-gray-300 shadow-sm"
            >
              {availableRoles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            
            <button
              type="button"
              onClick={() => {
                const newRoles = [...roles];
                newRoles.splice(roleIndex, 1);
                setRoles(newRoles);
              }}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Permissions</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Resource</th>
                  <th className="text-center">Read</th>
                  <th className="text-center">Write</th>
                  <th className="text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(role.permissions).map(([key, permission]) => (
                  <tr key={key}>
                    <td>{permission.name}</td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={permission.access.read}
                        onChange={(e) => handlePermissionChange(roleIndex, key, 'read', e.target.checked)}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={permission.access.write}
                        onChange={(e) => handlePermissionChange(roleIndex, key, 'write', e.target.checked)}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={permission.access.delete}
                        onChange={(e) => handlePermissionChange(roleIndex, key, 'delete', e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="font-medium mb-2">Features</h3>
            <div className="grid grid-cols-3 gap-4">
              {availableFeatures.map(feature => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={role.features.includes(feature)}
                    onChange={() => handleFeatureToggle(roleIndex, feature)}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}

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

export default RolePermissions;