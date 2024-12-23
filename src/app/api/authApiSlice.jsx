import { apiSlice } from './apiSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/login',
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
        url: '/api/auth/register',
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
    verifyUser: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/verify-user',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useVerifyUserMutation } =
  authApiSlice
