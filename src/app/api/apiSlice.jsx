import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    prepareHeaders: (headers, { getState }) => {
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

// baseUrl: 'https://e-commerce-api-200w.onrender.com',
