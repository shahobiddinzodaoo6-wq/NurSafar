import { baseApi } from "../store/baseApi";
import { AuthUser } from "../store/authSlice";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "CLIENT" | "PARTNER" | "DRIVER";
}

interface AuthResponse {
  user: AuthUser;
  access_token: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
