import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {API_CONFIG} from '../../utils/constants';
import {AuthService} from '../auth/authService';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`,
  prepareHeaders: async (headers, {getState}) => {
    // Get access token from storage
    const token = await AuthService.getAccessToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // If token expired, try to refresh
  if (result.error && result.error.status === 401) {
    const refreshToken = await AuthService.getRefreshToken();
    if (refreshToken) {
      // Try to refresh token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: {refreshToken},
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        // Save new token
        const {accessToken} = (refreshResult.data as any).data;
        await AuthService.saveTokens(accessToken, refreshToken);

        // Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout
        await AuthService.clearTokens();
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Event', 'Ticket', 'Notification'],
  endpoints: () => ({}),
});
