import { apiSlice } from '../../app/api/apiSlice'

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => '/api/wishlist',
      providesTags: ['Wishlist'],
    }),

    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: '/api/wishlist',
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: ['Wishlist'],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/api/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),

    clearWishlist: builder.mutation({
      query: () => ({
        url: '/api/wishlist',
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
})

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApiSlice 