import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// const baseUrl =
//   process.env.NODE_ENV === 'production'
//     ? 'https://threadcraft-ecommerce.onrender.com'
//     : 'http://localhost:3500/api'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://threadcraft-ecommerce.onrender.com',
    credentials: 'include',
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
//  baseUrl: 'http://localhost:3500',
