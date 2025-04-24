import { useGlobalStorage } from './useGlobalStorage';
import { UserMetadata } from '../types/user';

export const useAdmin = () => {
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);

  const isAdmin = (): boolean => {
    // Add console.log for debugging
    console.log('Current user role:', userMetadata?.profile?.role);
    return userMetadata?.profile?.role === 'admin' || userMetadata?.profile?.role === 'super-admin';
  };

  return { isAdmin };
};
