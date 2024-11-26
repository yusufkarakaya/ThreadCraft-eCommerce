import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useClearCartMutation } from '../features/cart/cartSlice'

const Success = () => {
  const [session, setSession] = useState(null)
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [clearCart, { isLoading: isClearing, isError: isClearError }] =
    useClearCartMutation()

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/checkout/session/${sessionId}`)
        const data = await response.json()
        setSession(data)
      } catch (error) {
        console.error('Error fetching session:', error)
      }
    }

    if (sessionId) {
      fetchSession()
    }
  }, [sessionId])

  useEffect(() => {
    if (session) {
      const clearUserCart = async () => {
        try {
          await clearCart().unwrap()
          console.log('Cart cleared successfully')
        } catch (error) {
          console.error('Failed to clear cart:', error)
        }
      }

      clearUserCart()
    }
  }, [session, clearCart])

  if (!session) {
    return <div>Loading...</div>
  }

  if (!session.line_items || !session.line_items.data) {
    return <div>Error: No line items found.</div>
  }

  return (
    <div className="pt-8">
      <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">
        Payment Successful!
      </h1>
      <p className="text-lg text-center">Thank you for your purchase.</p>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <ul>
          {session.line_items.data.map((item) => (
            <li key={item.id} className="my-2">
              <strong>{item.description}</strong> - Quantity: {item.quantity} -
              Price: ${(item.amount_total / 100).toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-bold">
          Total Paid: ${(session.amount_total / 100).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default Success
