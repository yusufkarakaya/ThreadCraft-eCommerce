import { apiSlice } from '../../app/api/apiSlice'

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: '/api/cart',
        credentials: 'include'
      }),
      providesTags: ['Cart'],
      transformResponse: (response) => {
        // Ensure we always have a valid cart structure
        return {
          ...response,
          products: response.products || []
        }
      }
    }),
    
    addToCart: builder.mutation({
      query: (data) => ({
        url: '/api/cart/product',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['Cart']
    }),
    
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/api/cart/product/${productId}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['Cart']
    }),
    
    increaseQuantity: builder.mutation({
      query: (productId) => ({
        url: `/api/cart/product/${productId}/increase`,
        method: 'PUT',
        credentials: 'include'
      }),
      invalidatesTags: ['Cart']
    }),
    
    decreaseQuantity: builder.mutation({
      query: (productId) => ({
        url: `/api/cart/product/${productId}/decrease`,
        method: 'PUT',
        credentials: 'include'
      }),
      invalidatesTags: ['Cart']
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: '/api/cart/clear',
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['Cart']
    })
  })
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useIncreaseQuantityMutation,
  useDecreaseQuantityMutation,
  useClearCartMutation
} = cartApiSlice 