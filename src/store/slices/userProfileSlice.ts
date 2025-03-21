import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserMetadata } from '../../types/user';

interface UserProfileState {
  profile: UserMetadata | null;
  pendingChanges: Partial<UserMetadata>;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  profile: null,
  pendingChanges: {},
  isLoading: false,
  error: null,
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserMetadata>) => {
      state.profile = action.payload;
      state.pendingChanges = {};
    },
    updateProfile: (state, action: PayloadAction<Partial<UserMetadata>>) => {
      state.pendingChanges = {
        ...state.pendingChanges,
        ...action.payload,
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetChanges: (state) => {
      state.pendingChanges = {};
    },
    saveChanges: (state) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...state.pendingChanges,
        };
        state.pendingChanges = {};
      }
    },
  },
});

export const {
  setProfile,
  updateProfile,
  setLoading,
  setError,
  resetChanges,
  saveChanges,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;