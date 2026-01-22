import {api} from './apiClient';
import {ApiResponse, Notification} from '../../types/api';

export const notificationsApi = api.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<
      ApiResponse<Notification[]>,
      {unreadOnly?: boolean} | void
    >({
      query: params => ({
        url: '/notifications',
        params: params || {},
      }),
      providesTags: ['Notification'],
    }),
    getNotification: builder.query<ApiResponse<Notification>, string>({
      query: id => `/notifications/${id}`,
      providesTags: (result, error, id) => [{type: 'Notification', id}],
    }),
    markAsRead: builder.mutation<ApiResponse<Notification>, string>({
      query: id => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation<ApiResponse<void>, string>({
      query: id => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
