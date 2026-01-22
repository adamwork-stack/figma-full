import {api} from './apiClient';
import {ApiResponse, User} from '../../types/api';

interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: builder => ({
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<ApiResponse<User>, UpdateUserRequest>({
      query: data => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    uploadAvatar: builder.mutation<
      ApiResponse<{avatar: string}>,
      FormData
    >({
      query: formData => ({
        url: '/users/me/avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useUploadAvatarMutation,
} = usersApi;
