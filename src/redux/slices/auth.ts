import {
  createSelector,
  createSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { RootState } from '../store';

export type User = {
  uid: string;
  displayName: string;
  email: string;
};

export interface AuthState {
  authenticated?: boolean;
  user?: User;
}

const initialState: AuthState = {
  authenticated: undefined,
  user: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.authenticated = true;
    },
    logoutUser: state => {
      state.user = undefined;
      state.authenticated = false;
    },
  },
});

// Actions generated from the slice
export const { loginUser, logoutUser } = authSlice.actions;

// export user selector to get the slice in any component
export const authSelector = (state: RootState) => state.auth;

// export user selector to get the slice in any component
export const userSelector = createSelector(authSelector, auth => {
  return auth.user;
});

export const isUserAuthenticatedSelector = createSelector(
  authSelector,
  auth => {
    return auth.authenticated;
  }
);

// export The reducer
const userReducer = authSlice.reducer;
export default userReducer;
