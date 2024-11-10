import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './app/store'
import { PersistGate } from 'redux-persist/integration/react'

import Layout from './components/Layout'
import ProductList from './features/products/ProductList'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import ProductDetails from './features/products/ProductDetails'
import CartDashboard from './features/cart/CartDashboard'

import AddNewProduct from './features/admin/AddNewProduct'
import EditProduct from './features/admin/EditProduct'
import AdminDashboard from './features/admin/AdminDashboard'

import AdminRoute from './features/admin/AdminRoute'

import Success from './components/Success'
import Cancel from './components/Cancel'
import VerificationForm from './components/VerificationForm'

import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools()
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<ProductList />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<CartDashboard />} />
              <Route path="/checkout/success" element={<Success />} />
              <Route path="/checkout/cancel" element={<Cancel />} />
            </Route>

            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/verification" element={<VerificationForm />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/new-product"
              element={
                <AdminRoute>
                  <AddNewProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/edit-product/:productId"
              element={
                <AdminRoute>
                  <EditProduct />
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
