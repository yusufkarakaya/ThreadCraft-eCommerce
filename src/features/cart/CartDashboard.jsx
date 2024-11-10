import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useIncreaseQuantityMutation,
  useDecreaseQuantityMutation,
} from './cartSlice'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser, selectIsVerified } from '../auth/authSlice'
import { useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'

// Stripe promise'ı component dışında oluştur
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const CartDashboard = () => {
  const isVerified = useSelector(selectIsVerified)

  const user = useSelector(selectUser)
  const {
    data: cart,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useGetCartQuery()

  const [removeFromCart] = useRemoveFromCartMutation()
  const [increaseQuantity] = useIncreaseQuantityMutation()
  const [decreaseQuantity] = useDecreaseQuantityMutation()

  // Kullanıcının oturum açmamış olması durumunda
  if (!user) {
    return (
      <div className="mt-5">You need to be logged in to view the cart.</div>
    )
  }

  // Cart değiştikçe yeniden veri getirme
  useEffect(() => {
    refetch()
  }, [refetch])

  // Sepet boşsa bilgilendirme
  if (cart && cart.products.length === 0) {
    return <div className="mt-5">Your cart is empty</div>
  }

  // Veri yüklenirken bekleme mesajı
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Hata durumunda hata mesajı
  if (isError) {
    return <div className="mt-5">Fetch Error</div>
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return <div className="mt-4">Your cart is empty.</div>
  }

  const subtotal = cart.products.reduce((total, productItem) => {
    return (
      total + (productItem?.product?.price || 0) * (productItem?.quantity || 0)
    )
  }, 0)

  const estimatedShipping = subtotal > 0 ? 0 : 0
  const estimatedTotal = subtotal + estimatedShipping

  const handleRemoveProduct = async (productId) => {
    try {
      await removeFromCart(productId).unwrap()
    } catch (error) {
      console.error('Failed to remove product:', error)
    }
  }

  const handleIncreaseQuantity = async (productId) => {
    try {
      await increaseQuantity(productId).unwrap()
    } catch (error) {
      console.error('Failed to increase product quantity:', error)
    }
  }

  const handleDecreaseQuantity = async (productId) => {
    try {
      await decreaseQuantity(productId).unwrap()
    } catch (error) {
      console.error('Failed to decrease product quantity:', error)
    }
  }

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      // Format the line items correctly
      const lineItems = cart.products.map((productItem) => ({
        name: productItem.product.name,
        price: productItem.product.price,
        quantity: productItem.quantity,
        image: productItem.product.imageUrl,
      }))

      const response = await fetch('/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if you're using session-based auth
        body: JSON.stringify({ items: lineItems }),
      })

      if (!response.ok) {
        const errorData = await response.text() // Use text() instead of json() first
        console.error('Response status:', response.status)
        console.error('Response text:', errorData)

        try {
          const jsonError = JSON.parse(errorData)
          throw new Error(
            jsonError.error || 'Failed to create checkout session'
          )
        } catch (e) {
          throw new Error('Failed to create checkout session')
        }
      }

      const session = await response.json()
      if (session.url) {
        window.location.href = session.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to initiate checkout. Please try again.')
    }
  }

  return (
    <div className="pt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        YOUR BAG
      </h1>
      <hr />
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold pt-2 mb-4">
            {user.username}'s Cart
          </h2>
          {isSuccess && cart.products.length > 0 ? (
            <ul className="space-y-4">
              {cart.products.map((productItem, index) => (
                <li
                  key={productItem?.product?._id || index}
                  className="flex items-center border-b pb-4"
                >
                  {productItem?.product?.imageUrl && (
                    <img
                      className="w-20 h-20 rounded-md mr-4"
                      src={`${productItem?.product?.imageUrl}`}
                      alt={productItem?.product?.name}
                    />
                  )}
                  <div className="flex-grow">
                    <p className="text-lg font-semibold">
                      {productItem?.product?.name}
                    </p>
                    <p className="text-gray-600">
                      ${productItem?.product?.price}
                    </p>
                    <div className="mt-1">
                      Quantity: {productItem?.quantity}
                    </div>
                    <div className="mt-1 flex gap-2">
                      <button
                        onClick={() =>
                          handleIncreaseQuantity(productItem?.product?._id)
                        }
                        className="py-1 px-5 border bg-transparent border-solid font-semibold rounded-md shadow-sm border-main-text hover:bg-main-text hover:text-white transition-all"
                      >
                        +
                      </button>
                      <button
                        onClick={() =>
                          handleDecreaseQuantity(productItem?.product?._id)
                        }
                        className="py-1 px-5 border bg-transparent border-solid font-semibold rounded-md shadow-sm border-main-text hover:bg-main-text hover:text-white transition-all"
                      >
                        -
                      </button>
                    </div>
                  </div>
                  <button
                    className="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() =>
                      handleRemoveProduct(productItem?.product?._id)
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>Your cart is empty</div>
          )}
        </div>

        <div className="md:w-1/3 mt-8 md:mt-0 md:ml-8 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">ORDER SUMMARY</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Estimated Shipping</span>
            <span>${estimatedShipping.toFixed(2)}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Estimated Total</span>
            <span>${estimatedTotal.toFixed(2)}</span>
          </div>
          {isVerified ? (
            <button
              onClick={handleCheckout}
              className="bg-black text-white w-full py-3 mt-6 rounded-lg hover:bg-gray-800 transition-all"
            >
              CHECKOUT NOW
            </button>
          ) : (
            <Link to="/auth/verification">
              <button className="bg-red-900 text-white w-full py-3 mt-6 rounded-lg hover:bg-gray-800 transition-all">
                Please verify your Email
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartDashboard
