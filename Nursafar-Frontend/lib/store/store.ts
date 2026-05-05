import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import authReducer from "./authSlice";

function getPreloadedAuth() {
  if (typeof window === "undefined") return undefined;
  try {
    const token = localStorage.getItem("nursafar_token");
    const userStr = localStorage.getItem("nursafar_user");
    if (token && userStr) {
      return { user: JSON.parse(userStr), token, isAuthenticated: true };
    }
  } catch {}
  return undefined;
}

const preloadedAuth = getPreloadedAuth();

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  preloadedState: preloadedAuth ? { auth: preloadedAuth } : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
