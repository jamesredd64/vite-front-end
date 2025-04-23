/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { adminSettingsService } from '../../services/adminSettingsService';
import { AdminSettings } from '../../types/settings';
import { Tabs, Tab } from '../../components/Tabs';
import AutoEventConfig from './settings/AutoEventConfig';
import RolePermissions from './settings/RolePermissions';
import EmailTemplates from './settings/EmailTemplates';
import SecuritySettings from './settings/SecuritySettings';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [activeTab, setActiveTab] = useState('autoEvent');
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminSettingsService.getSettings(() => getAccessTokenSilently());
      setSettings(data);
      console.log("admin Settings has been fetched");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch settings';
      setError(errorMessage);
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSave = async (section: string, data: Partial<AdminSettings>) => {
    try {
      await adminSettingsService.updateSettings(
        section as keyof AdminSettings,
        data[section as keyof AdminSettings] as Partial<AdminSettings[keyof AdminSettings]>,
        () => getAccessTokenSilently()
      );
      await fetchSettings();
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!settings) {
    { console.log("No admin Settings fetched"); }
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
      
      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        <Tab id="autoEvent" label="Auto Event">
          <AutoEventConfig 
            settings={settings?.autoEvent} 
            onSave={(data) => handleSave('autoEvent', { autoEvent: data })} 
          />
        </Tab>
        
        <Tab id="roles" label="Role Permissions">
          <RolePermissions 
            settings={settings?.roleBasedAccess} 
            onSave={(data) => handleSave('roleBasedAccess', { roleBasedAccess: data })} 
          />
        </Tab>
        
        <Tab id="email" label="Email Templates">
          <EmailTemplates 
            settings={settings?.emailTemplates} 
            onSave={(data) => handleSave('emailTemplates', { emailTemplates: data })} 
          />
        </Tab>
        
        <Tab id="security" label="Security">
          <SecuritySettings 
            settings={settings?.security} 
            onSave={(data) => handleSave('security', { security: data })} 
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Settings;





