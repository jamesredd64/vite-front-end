import { useGlobalStorage } from './useGlobalStorage';
import { UserMetadata } from '../types/user';
import { useEffect, useState, useCallback } from 'react';

export const useAdmin = () => {
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const [state, setState] = useState({
    isAdmin: false,
    isLoading: true
  });

  const checkAdminStatus = useCallback(() => {
    // Wait for userMetadata to be available
    if (!userMetadata) {
      return false;
    }

    const role = userMetadata?.profile?.role;
    console.log('[useAdmin Hook] Checking admin status:', {
      currentRole: role,
      metadata: userMetadata
    });

    return ['admin', 'super-admin'].includes(role || '');
  }, [userMetadata]);

  useEffect(() => {
    const adminStatus = checkAdminStatus();
    
    console.log('[useAdmin Hook] Setting state:', {
      isAdmin: adminStatus,
      userMetadata: userMetadata
    });

    setState({
      isAdmin: adminStatus,
      isLoading: false
    });
  }, [userMetadata, checkAdminStatus]);

  return state;
};
