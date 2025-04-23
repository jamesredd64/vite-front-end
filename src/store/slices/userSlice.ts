import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  role: string;
  gender: string;
  dateOfBirth: string | null;
  profilePictureUrl: string;
}

interface User {
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profile: UserProfile;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
