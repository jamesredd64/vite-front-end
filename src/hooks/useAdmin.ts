import { useGlobalStorage } from './useGlobalStorage';
import { UserMetadata } from '../types/user';
import { useEffect, useState } from 'react';

export const useAdmin = () => {
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const [state, setState] = useState({
    isAdmin: false,
    isLoading: false
  });

  useEffect(() => {
    console.log('[useAdmin Hook]', {
      hasUserMetadata: !!userMetadata,
      userRole: userMetadata?.profile?.role,
      currentState: state
    });

    if (!userMetadata) {
      console.log('[useAdmin Hook]', 'No user metadata, setting non-admin state');
      setState({ isAdmin: false, isLoading: false });
      return;
    }

    const adminStatus = userMetadata.profile?.role === 'admin' || 
                       userMetadata.profile?.role === 'super-admin';
    
    console.log('[useAdmin Hook]', `Setting admin status to: ${adminStatus}`);
    setState({
      isAdmin: adminStatus,
      isLoading: false
    });
  }, [userMetadata]);

  return state;
};
