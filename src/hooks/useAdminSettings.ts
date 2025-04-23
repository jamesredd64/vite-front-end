import { useState, useEffect } from 'react';
import { adminSettingsService } from '../services/adminSettingsService';
import { useAuth0 } from '@auth0/auth0-react';
import { AdminSettings } from '../types/settings';

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = await adminSettingsService.getSettings(() => Promise.resolve(token));
        setSettings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [getAccessTokenSilently]);

  return { settings, isLoading, error };
};

