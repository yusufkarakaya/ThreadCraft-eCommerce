import React from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiArrowLeft, FiLock, FiCreditCard, FiShield } from 'react-icons/fi'
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartItemMutation } from '../features/cart/cartSlice'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const CartPage = () => {
  const { data: cart, isLoading } = useGetCartQuery()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [updateCartItem] = useUpdateCartItemMutation()

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId).unwrap()
    } catch (err) {
      console.error('Failed to remove from cart:', err)
    }
  }

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCartItem({ productId, quantity }).unwrap()
    } catch (err) {
      console.error('Failed to update quantity:', err)
    }
  }

  const subtotal = cart?.items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ) || 0

  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shipping + tax

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Container>
    )
  }

  if (!cart?.items?.length) {
    return (
      <Container>
        <div className="min-h-screen py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button to="/products" variant="primary" className="inline-flex items-center">
              <FiArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            {/* Cart Items */}
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item._id} className="py-6">
                  <div className="flex items-center">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/products/${item._id}`} className="hover:text-indigo-600">
                              {item.title}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && (
                              <span className="ml-4">Color: {item.color}</span>
                            )}
                          </p>
                        </div>
                        <p className="text-lg font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))
                            }
                            className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                          >
                            <span className="sr-only">Decrease quantity</span>
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <span className="text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                            className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                          >
                            <span className="sr-only">Increase quantity</span>
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item._id)}
                          className="text-sm font-medium text-rose-600 hover:text-rose-500"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Button
                to="/products"
                variant="outline"
                className="inline-flex items-center"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="rounded-lg bg-gray-50 px-6 py-8">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="text-sm font-medium text-gray-900">
                    ${tax.toFixed(2)}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900">Promo Code</h3>
                <div className="mt-2 flex space-x-4">
                  <Input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1"
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-8">
                <Button
                  to="/checkout"
                  variant="primary"
                  className="w-full flex items-center justify-center"
                >
                  <FiLock className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FiShield className="mr-2 h-5 w-5 text-green-500" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiCreditCard className="mr-2 h-5 w-5 text-green-500" />
                  <span>Multiple payment options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default CartPage 