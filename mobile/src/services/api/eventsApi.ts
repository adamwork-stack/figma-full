import {api} from './apiClient';
import {ApiResponse, PaginatedResponse, Event} from '../../types/api';

interface QueryEventsParams {
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export const eventsApi = api.injectEndpoints({
  endpoints: builder => ({
    getEvents: builder.query<
      PaginatedResponse<Event>,
      QueryEventsParams | void
    >({
      query: params => ({
        url: '/events',
        params: params || {},
      }),
      providesTags: ['Event'],
    }),
    getEvent: builder.query<ApiResponse<Event>, string>({
      query: id => `/events/${id}`,
      providesTags: (result, error, id) => [{type: 'Event', id}],
    }),
    createEvent: builder.mutation<ApiResponse<Event>, any>({
      query: eventData => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ['Event'],
    }),
    updateEvent: builder.mutation<
      ApiResponse<Event>,
      {id: string; data: any}
    >({
      query: ({id, data}) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Event', id}],
    }),
    deleteEvent: builder.mutation<ApiResponse<void>, string>({
      query: id => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;
