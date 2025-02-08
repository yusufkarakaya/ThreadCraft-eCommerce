import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { apiSlice } from './api/apiSlice'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token']
}

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['products', 'guestId']
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer)

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: persistedAuthReducer,
    cart: persistedCartReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: true
})

export const persistor = persistStore(store) 