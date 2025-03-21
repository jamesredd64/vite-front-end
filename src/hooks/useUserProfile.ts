import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import {
  setProfile,
  updateProfile,
  setLoading,
  setError,
  setHasUnsavedChanges,
  resetChanges,
  saveChanges
} from '../store/slices/userProfileSlice';
import { UserMetadata } from '../types/user';

export const useUserProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.userProfile.profile);
  const pendingChanges = useSelector((state: RootState) => state.userProfile.pendingChanges);
  const isLoading = useSelector((state: RootState) => state.userProfile.isLoading);
  const error = useSelector((state: RootState) => state.userProfile.error);
  const hasUnsavedChanges = useSelector((state: RootState) => state.userProfile.hasUnsavedChanges);

  return {
    profile,
    pendingChanges,
    isLoading,
    error,
    hasUnsavedChanges,
    setProfile: (profile: UserMetadata) => dispatch(setProfile(profile)),
    updateProfile: (changes: Partial<UserMetadata>) => dispatch(updateProfile(changes)),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    setError: (error: string | null) => dispatch(setError(error)),
    setHasUnsavedChanges: (value: boolean) => dispatch(setHasUnsavedChanges(value)),
    resetChanges: () => dispatch(resetChanges()),
    saveChanges: () => dispatch(saveChanges())
  };
};