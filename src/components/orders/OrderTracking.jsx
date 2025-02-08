import React, { useState } from 'react'
import { FiPackage, FiTruck, FiCheck, FiMapPin } from 'react-icons/fi'
import { useGetOrderStatusQuery } from '../../features/orders/ordersSlice'
import Button from '../ui/Button'
import Input from '../ui/Input'

const statusSteps = [
  { id: 'processing', icon: FiPackage, label: 'Order Processing' },
  { id: 'shipped', icon: FiTruck, label: 'Order Shipped' },
  { id: 'outForDelivery', icon: FiMapPin, label: 'Out for Delivery' },
  { id: 'delivered', icon: FiCheck, label: 'Delivered' },
]

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('')
  const [trackOrder, setTrackOrder] = useState(false)
  const { data: orderStatus, isLoading, error } = useGetOrderStatusQuery(
    orderNumber,
    { skip: !trackOrder }
  )

  const handleTrackOrder = (e) => {
    e.preventDefault()
    setTrackOrder(true)
  }

  const getCurrentStep = () => {
    if (!orderStatus) return -1
    return statusSteps.findIndex((step) => step.id === orderStatus.currentStatus)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Track Your Order</h2>
        <p className="mt-2 text-gray-600">
          Enter your order number to track your package
        </p>
      </div>

      <form onSubmit={handleTrackOrder} className="mb-8">
        <div className="flex gap-4">
          <Input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter order number"
            className="flex-1"
            required
          />
          <Button type="submit" variant="primary">
            Track Order
          </Button>
        </div>
      </form>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 py-4">
          {error.status === 404
            ? 'Order not found. Please check the order number and try again.'
            : 'An error occurred while tracking your order. Please try again.'}
        </div>
      )}

      {orderStatus && (
        <div className="space-y-8">
          {/* Status Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-gray-200" />
            <div className="relative space-y-8">
              {statusSteps.map((step, index) => {
                const currentStep = getCurrentStep()
                const isCompleted = index <= currentStep
                const isCurrent = index === currentStep

                return (
                  <div
                    key={step.id}
                    className={`flex items-center ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`w-1/2 ${
                        index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">{step.label}</h3>
                      {isCurrent && orderStatus.estimatedDelivery && (
                        <p className="text-sm text-gray-500">
                          Estimated: {new Date(orderStatus.estimatedDelivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tracking Details */}
          {orderStatus.trackingDetails && (
            <div className="mt-8 rounded-lg bg-gray-50 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Tracking Details</h3>
              <div className="space-y-4">
                {orderStatus.trackingDetails.map((detail, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 mt-2 rounded-full bg-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {detail.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(detail.timestamp).toLocaleString()}
                      </p>
                      {detail.location && (
                        <p className="text-sm text-gray-500">{detail.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderTracking 