import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
}


const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrating: true,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isHydrating = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isHydrating = false;
    },
    setHydrated(state) {
      state.isHydrating = false;
    },
  },
});



export const { setCredentials, logout, setHydrated } = authSlice.actions;
export default authSlice.reducer;
