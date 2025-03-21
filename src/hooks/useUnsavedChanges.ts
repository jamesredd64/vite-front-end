import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setHasUnsavedChanges } from '../store/slices/userProfileSlice';

export const useUnsavedChanges = () => {
  const dispatch = useDispatch();
  const hasUnsavedChanges = useSelector((state: RootState) => state.userProfile.hasUnsavedChanges);

  const setChanges = (value: boolean) => {
    dispatch(setHasUnsavedChanges(value));
  };

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges: setChanges,
  };
};