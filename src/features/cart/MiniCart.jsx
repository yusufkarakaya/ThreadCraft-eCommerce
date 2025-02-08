import React from 'react'
import { Link } from 'react-router-dom'
import { Popover, Transition } from '@headlessui/react'
import { FiShoppingCart, FiX, FiTrash2 } from 'react-icons/fi'
import { useGetCartQuery, useRemoveFromCartMutation } from './cartSlice'
import Button from '../../components/ui/Button'

const MiniCart = () => {
  const { data: cart } = useGetCartQuery()
  const [removeFromCart] = useRemoveFromCartMutation()

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId).unwrap()
    } catch (err) {
      console.error('Failed to remove from cart:', err)
    }
  }

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cart?.items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ) || 0

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              relative rounded-full p-2 text-gray-400 hover:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            `}
          >
            <span className="sr-only">Shopping cart</span>
            <FiShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                {totalItems}
              </span>
            )}
          </Popover.Button>

          <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              static
              className="absolute right-0 z-10 mt-2 w-80 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="p-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                  <Popover.Button className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Close cart</span>
                    <FiX className="h-5 w-5" />
                  </Popover.Button>
                </div>

                {!cart?.items?.length ? (
                  <div className="py-6 text-center">
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-gray-200">
                      {cart.items.map((item) => (
                        <li key={item._id} className="flex py-4">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex flex-1 flex-col">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-gray-900">
                                  <Link to={`/products/${item._id}`}>
                                    {item.title}
                                  </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  Qty {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between">
                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(item._id)}
                                className="text-sm font-medium text-rose-600 hover:text-rose-500"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${subtotal.toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-4 space-y-2">
                        <Button
                          to="/cart"
                          variant="primary"
                          className="w-full"
                        >
                          View Cart
                        </Button>
                        <Button
                          to="/checkout"
                          variant="outline"
                          className="w-full"
                        >
                          Checkout
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default MiniCart 