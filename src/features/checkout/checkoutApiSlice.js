import { apiSlice } from '../../app/api/apiSlice'

export const checkoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/api/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const { useCreateOrderMutation } = checkoutApiSlice 