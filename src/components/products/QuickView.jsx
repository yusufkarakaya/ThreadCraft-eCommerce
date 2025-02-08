import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FiX, FiMinus, FiPlus, FiHeart } from 'react-icons/fi'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { useAddToCartMutation } from '../../features/cart/cartSlice'
import { useAddToWishlistMutation } from '../../features/wishlist/wishlistSlice'

const QuickView = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [addToCart] = useAddToCartMutation()
  const [addToWishlist] = useAddToWishlistMutation()

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      }).unwrap()
      onClose()
    } catch (err) {
      console.error('Failed to add to cart:', err)
    }
  }

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product._id).unwrap()
    } catch (err) {
      console.error('Failed to add to wishlist:', err)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="relative mx-auto max-w-2xl w-full bg-white rounded-2xl shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 p-6">
            {/* Image Gallery */}
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                  {product.title}
                </h2>

                <div className="mt-3">
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-3xl text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                {product.stock > 0 ? (
                  <Badge variant="success" className="mt-4">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="error" className="mt-4">
                    Out of Stock
                  </Badge>
                )}

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">
                    Description
                  </h3>
                  <div className="mt-2 text-sm text-gray-600">
                    {product.description}
                  </div>
                </div>

                {/* Size Selector */}
                {product.sizes && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          className={`
                            px-4 py-2 text-sm font-medium rounded-md
                            ${
                              selectedSize === size
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }
                          `}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900">Color</h3>
                    <div className="mt-2 flex space-x-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          className={`
                            w-8 h-8 rounded-full border-2
                            ${
                              selectedColor === color
                                ? 'border-indigo-600'
                                : 'border-transparent'
                            }
                          `}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                  <div className="mt-2 flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="text-gray-900 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex space-x-4">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToWishlist}
                >
                  <FiHeart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default QuickView 