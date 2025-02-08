import { createSlice } from '@reduxjs/toolkit'
import { cartApiSlice } from './cartApiSlice'
import { logOut, setCredentials } from '../auth/authSlice'

const initialState = {
  guestId: null,
  products: [],
  status: 'idle',
  error: null,
  lastKnownState: null
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setGuestId: (state, action) => {
      state.guestId = action.payload
    },
    clearCart: (state) => {
      state.products = []
      state.lastKnownState = null
    },
    updateCartItems: (state, action) => {
      state.products = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setCredentials, (state, action) => {
        // When user logs in, clear the guest state
        state.guestId = null
        state.products = []
        state.lastKnownState = null
      })
      .addCase(logOut, (state) => {
        // When user logs out, clear everything
        state.products = []
        state.lastKnownState = null
        state.guestId = null
      })
      .addMatcher(
        cartApiSlice.endpoints.getCart.matchFulfilled,
        (state, { payload }) => {
          if (payload) {
            state.products = payload.products || []
            if (payload.guestId) {
              state.guestId = payload.guestId
            }
          }
          state.status = 'succeeded'
          state.error = null
        }
      )
      .addMatcher(
        cartApiSlice.endpoints.addToCart.matchFulfilled,
        (state, { payload }) => {
          if (payload) {
            state.products = payload.products || []
          }
          state.status = 'succeeded'
          state.error = null
        }
      )
      .addMatcher(
        cartApiSlice.endpoints.removeFromCart.matchFulfilled,
        (state, { payload }) => {
          if (payload) {
            state.products = payload.products || []
          }
          state.status = 'succeeded'
          state.error = null
        }
      )
      .addMatcher(
        cartApiSlice.endpoints.increaseQuantity.matchFulfilled,
        (state, { payload }) => {
          if (payload) {
            state.products = payload.products || []
          }
          state.status = 'succeeded'
          state.error = null
        }
      )
      .addMatcher(
        cartApiSlice.endpoints.decreaseQuantity.matchFulfilled,
        (state, { payload }) => {
          if (payload) {
            state.products = payload.products || []
          }
          state.status = 'succeeded'
          state.error = null
        }
      )
      .addMatcher(
        cartApiSlice.endpoints.clearCart.matchFulfilled,
        (state) => {
          state.products = []
          state.status = 'succeeded'
          state.error = null
        }
      )
      .addMatcher(
        cartApiSlice.endpoints.getCart.matchPending,
        (state) => {
          state.status = 'loading'
        }
      )
      .addMatcher(
        cartApiSlice.endpoints.getCart.matchRejected,
        (state, { error }) => {
          state.status = 'failed'
          state.error = error.message
        }
      )
  }
})

export const { 
  setGuestId, 
  clearCart, 
  updateCartItems
} = cartSlice.actions

export default cartSlice.reducer

export const selectGuestId = (state) => state.cart.guestId
export const selectCartProducts = (state) => state.cart.products
export const selectCartStatus = (state) => state.cart.status
export const selectCartError = (state) => state.cart.error 