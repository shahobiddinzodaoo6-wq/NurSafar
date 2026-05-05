import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT" | "PARTNER" | "DRIVER";
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: AuthUser; access_token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("nursafar_token", action.payload.access_token);
        localStorage.setItem("nursafar_user", JSON.stringify(action.payload.user));
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("nursafar_token");
        localStorage.removeItem("nursafar_user");
      }
    },
    loadFromStorage(state) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("nursafar_token");
        const userStr = localStorage.getItem("nursafar_user");
        if (token && userStr) {
          state.token = token;
          state.user = JSON.parse(userStr);
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { setCredentials, logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
