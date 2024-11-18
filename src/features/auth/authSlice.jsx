import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload || {}
      state.token = token
      state.user = user
      state.isAuthenticated = true
    },
    logOut: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setCredentials, logOut } = authSlice.actions
export default authSlice.reducer

export const selectToken = (state) => state.auth.token
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectIsVerified = (state) => state.auth.user?.isVerified
