import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://e-commerce-api-200w.onrender.com'
    : 'http://localhost:3500',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    api.dispatch(logOut())
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Cart', 'User'],
  endpoints: () => ({}),
})

export default apiSlice

// baseUrl: 'https://e-commerce-api-200w.onrender.com',
//  baseUrl: 'http://localhost:3500',
