import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Assuming your state structure looks like state.auth.token
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth slice in the Redux state
      const token = getState().auth.token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Product', 'Cart'],
  endpoints: (builder) => ({}),
})

export default apiSlice
