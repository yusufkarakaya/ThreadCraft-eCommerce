import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useIncreaseQuantityMutation,
  useDecreaseQuantityMutation,
} from './cartSlice'
import { useSelector } from 'react-redux'
import { selectUser } from '../auth/authSlice'
import { useEffect } from 'react'

const CartDashboard = () => {
  const user = useSelector(selectUser)
  const {
    data: cart,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useGetCartQuery(user?.id)

  const [removeFromCart] = useRemoveFromCartMutation()
  const [increaseQuantity] = useIncreaseQuantityMutation()
  const [decreaseQuantity] = useDecreaseQuantityMutation()

  useEffect(() => {
    if (user) {
      refetch()
    }
  }, [user, refetch])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div className="mt-5">Please Log In and enjoy your shopping!</div>
  }

  if (!user) {
    return (
      <div className="mt-5">You need to be logged in to view the cart.</div>
    )
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return <div className="mt-4">Your cart is empty.</div>
  }

  const subtotal = cart.products.reduce((total, productItem) => {
    return (
      total + (productItem?.product?.price || 0) * (productItem?.quantity || 0)
    )
  }, 0)

  const estimatedShipping = subtotal > 0 ? 0 : 0 // Assuming free shipping for simplicity
  const estimatedTotal = subtotal + estimatedShipping

  const handleRemoveProduct = async (productId) => {
    try {
      await removeFromCart(productId).unwrap()
      console.log('Product removed from cart successfully')
    } catch (error) {
      console.error('Failed to remove product:', error)
    }
  }

  const handleIncreaseQuantity = async (productId) => {
    try {
      await increaseQuantity(productId).unwrap()
      console.log('Product quantity increased successfully')
    } catch (error) {
      console.error('Failed to increase product quantity:', error)
    }
  }

  const handleDecreaseQuantity = async (productId) => {
    try {
      await decreaseQuantity(productId).unwrap()
      console.log('Product quantity decreased successfully')
    } catch (error) {
      console.error('Failed to decrease product quantity:', error)
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

        {/* Order Summary Section */}
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
          <button className="bg-black text-white w-full py-3 mt-6 rounded-lg hover:bg-gray-800 transition-all">
            CHECKOUT NOW
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartDashboard
