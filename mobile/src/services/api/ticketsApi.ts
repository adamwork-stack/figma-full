import {api} from './apiClient';
import {ApiResponse, Ticket} from '../../types/api';

interface PurchaseTicketsRequest {
  eventId: string;
  tickets: Array<{
    ticketTypeId: string;
    quantity: number;
    attendees: Array<{
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
    }>;
  }>;
  paymentMethodId: string;
}

interface PurchaseTicketsResponse {
  orderId: string;
  tickets: Ticket[];
  totalAmount: number;
  currency: string;
  status: string;
}

export const ticketsApi = api.injectEndpoints({
  endpoints: builder => ({
    getTickets: builder.query<ApiResponse<Ticket[]>, void>({
      query: () => '/tickets',
      providesTags: ['Ticket'],
    }),
    getTicket: builder.query<ApiResponse<Ticket>, string>({
      query: id => `/tickets/${id}`,
      providesTags: (result, error, id) => [{type: 'Ticket', id}],
    }),
    purchaseTickets: builder.mutation<
      ApiResponse<PurchaseTicketsResponse>,
      PurchaseTicketsRequest
    >({
      query: data => ({
        url: '/tickets/purchase',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Ticket'],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  usePurchaseTicketsMutation,
} = ticketsApi;
