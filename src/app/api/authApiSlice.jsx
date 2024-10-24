import { apiSlice } from './apiSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        const { accessToken, user } = response
        return {
          token: accessToken,
          user: user,
        }
      },
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        const { user } = response
        return {
          user: user,
        }
      },
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation } = authApiSlice
