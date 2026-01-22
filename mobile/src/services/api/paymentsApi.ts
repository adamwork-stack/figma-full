import {api} from './apiClient';
import {ApiResponse} from '../../types/api';

interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  eventId: string;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
}

interface ConfirmPaymentRequest {
  paymentIntentId: string;
  orderId: string;
}

export const paymentsApi = api.injectEndpoints({
  endpoints: builder => ({
    createPaymentIntent: builder.mutation<
      ApiResponse<CreatePaymentIntentResponse>,
      CreatePaymentIntentRequest
    >({
      query: data => ({
        url: '/payments/intent',
        method: 'POST',
        body: data,
      }),
    }),
    confirmPayment: builder.mutation<
      ApiResponse<any>,
      ConfirmPaymentRequest
    >({
      query: data => ({
        url: '/payments/confirm',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} = paymentsApi;
