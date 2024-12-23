import { apiSlice } from '../../app/api/apiSlice'

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: `/api/cart`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Cart', id: _id })),
              { type: 'Cart', id: 'LIST' },
            ]
          : [{ type: 'Cart', id: 'LIST' }],
    }),
    addToCart: builder.mutation({
      query: (cartItem) => ({
        url: `/api/cart/add`,
        method: 'POST',
        body: cartItem,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/api/cart/product/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    increaseQuantity: builder.mutation({
      query: (productId) => ({
        url: `/api/cart/product/${productId}/increase`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),
    decreaseQuantity: builder.mutation({
      query: (productId) => ({
        url: `/api/cart/product/${productId}/decrease`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `/api/cart/clearCart`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useIncreaseQuantityMutation,
  useDecreaseQuantityMutation,
  useClearCartMutation,
} = cartApiSlice

export const cartReducer = cartApiSlice.reducer
