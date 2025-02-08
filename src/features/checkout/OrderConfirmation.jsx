import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetOrderQuery } from './checkoutApiSlice'

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const { data: order, isLoading } = useGetOrderQuery(orderId)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order number is #{orderId}
          </p>

          <div className="border-t border-b py-4 my-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {order?.items?.map((item) => (
              <div key={item.product._id} className="flex justify-between py-2">
                <span>{item.product.name} x {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${order?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/shop"
              className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation 