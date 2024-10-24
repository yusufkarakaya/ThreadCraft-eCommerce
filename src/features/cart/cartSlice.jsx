import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const cartAdapter = createEntityAdapter()

const initialState = cartAdapter.getInitialState()

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: (userId) => ({
        url: `/cart/user/${userId}`,
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
        url: `/cart/add`,
        method: 'POST',
        body: cartItem,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/product/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    increaseQuantity: builder.mutation({
      query: (productId) => ({
        url: `/cart/product/${productId}/increase`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),
    decreaseQuantity: builder.mutation({
      query: (productId) => ({
        url: `/cart/product/${productId}/decrease`,
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
} = cartApiSlice

export const cartReducer = cartApiSlice.reducer

export const selectCart = (state) => state.cart

export const selectCartItems = createSelector(selectCart, (cart) => {
  return cartAdapter.getSelectors().selectAll(cart)
})

export const selectCartTotal = createSelector(selectCartItems, (cartItems) => {
  return cartItems.reduce((total, item) => total + item.price, 0)
})
