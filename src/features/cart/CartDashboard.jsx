import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated } from '../auth/authSlice'
import { selectCartStatus, selectCartError, selectGuestId } from './cartSlice'
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useIncreaseQuantityMutation,
  useDecreaseQuantityMutation,
} from './cartApiSlice'

const CartDashboard = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const cartStatus = useSelector(selectCartStatus)
  const cartError = useSelector(selectCartError)
  const guestId = useSelector(selectGuestId)

  const { data: cart, isLoading, refetch } = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 0,
    refetchOnFocus: false,
    refetchOnReconnect: false
  })

  useEffect(() => {
    console.log('Current User:', user)
    console.log('Is Authenticated:', isAuthenticated)
    console.log('Cart Data:', cart)
    console.log('Guest ID:', guestId)
    console.log('Cart Status:', cartStatus)
  }, [user, isAuthenticated, cart, guestId, cartStatus])

  const [removeFromCart] = useRemoveFromCartMutation()
  const [increaseQuantity] = useIncreaseQuantityMutation()
  const [decreaseQuantity] = useDecreaseQuantityMutation()

  useEffect(() => {
    // Fetch cart data when authentication state changes
    if (isAuthenticated || (!isAuthenticated && guestId)) {
      refetch()
    }
  }, [isAuthenticated, guestId, refetch])

  const calculateSubtotal = () => {
    const products = cart?.products || []
    if (!products.length) return 0
    return products.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  const calculateTax = (subtotal) => {
    return subtotal * 0.08 // 8% tax
  }

  const calculateTotal = (subtotal, tax) => {
    return subtotal + tax
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId).unwrap()
    } catch (err) {
      console.error('Failed to remove product:', err)
    }
  }

  const handleIncrease = async (productId) => {
    try {
      await increaseQuantity(productId).unwrap()
    } catch (err) {
      console.error('Failed to increase quantity:', err)
    }
  }

  const handleDecrease = async (productId) => {
    try {
      await decreaseQuantity(productId).unwrap()
    } catch (err) {
      console.error('Failed to decrease quantity:', err)
    }
  }

  if (isLoading || cartStatus === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (cartError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Error loading cart</h2>
        <p className="text-gray-600 mb-8">{cartError}</p>
        <button
          onClick={() => refetch()}
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  const cartProducts = cart?.products || []
  const subtotal = calculateSubtotal()
  const tax = calculateTax(subtotal)
  const total = calculateTotal(subtotal, tax)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartProducts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartProducts.map((item) => (
              <div key={item.product._id} 
                   className="flex flex-col md:flex-row items-center gap-4 p-4 mb-4 bg-white rounded-lg shadow">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-semibold">{item.product.name}</h2>
                  <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => handleDecrease(item.product._id)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(item.product._id)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full text-center bg-green-600 text-white py-3 rounded-lg mt-6 hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping</p>
          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  )
}

export default CartDashboard
