import {api} from './apiClient';
import {ApiResponse, User} from '../../types/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
      query: userData => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    refreshToken: builder.mutation<
      ApiResponse<RefreshTokenResponse>,
      RefreshTokenRequest
    >({
      query: data => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
