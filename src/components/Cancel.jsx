import React from 'react'

const Cancel = () => {
  return (
    <div className="pt-8">
      <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">
        Payment Cancelled
      </h1>
      <p className="text-lg text-center">
        Your payment was cancelled. If you need help, please contact support.
      </p>
      <p className="text-center mt-8">
        <a href="/cart" className="text-blue-500 underline">
          Return to Cart
        </a>
      </p>
    </div>
  )
}

export default Cancel
