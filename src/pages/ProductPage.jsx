import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiPackage } from 'react-icons/fi'
import { useGetProductQuery } from '../features/products/productsSlice'
import { useAddToCartMutation } from '../features/cart/cartSlice'
import { useAddToWishlistMutation } from '../features/wishlist/wishlistSlice'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ProductGallery from '../components/products/ProductGallery'
import ProductReviews from '../components/products/ProductReviews'
import RelatedProducts from '../components/products/RelatedProducts'

const ProductPage = () => {
  const { id } = useParams()
  const { data: product, isLoading } = useGetProductQuery(id)
  const [addToCart] = useAddToCartMutation()
  const [addToWishlist] = useAddToWishlistMutation()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      }).unwrap()
    } catch (err) {
      console.error('Failed to add to cart:', err)
    }
  }

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(id).unwrap()
    } catch (err) {
      console.error('Failed to add to wishlist:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Failed to share:', err)
      }
    }
  }

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Product Gallery */}
          <div className="lg:max-w-xl">
            <ProductGallery images={product.images} />
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2"
              >
                <FiShare2 className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </div>

            {/* Price and Stock */}
            <div className="mt-6 flex items-center space-x-4">
              <p className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
              {product.discount > 0 && (
                <>
                  <p className="text-lg text-gray-500 line-through">
                    ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                  </p>
                  <Badge variant="warning">
                    {product.discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              {product.stock > 0 ? (
                <Badge variant="success" size="lg">
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant="error" size="lg">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <div className="mt-2 prose prose-sm text-gray-600">
                {product.description}
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Select Size</h2>
                <div className="mt-2 grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        flex items-center justify-center rounded-md py-2 px-4
                        text-sm font-medium uppercase
                        ${
                          selectedSize === size
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }
                      `}
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
                <h2 className="text-lg font-medium text-gray-900">Select Color</h2>
                <div className="mt-2 flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        relative h-10 w-10 rounded-full
                        ${selectedColor === color ? 'ring-2 ring-indigo-600' : ''}
                      `}
                      style={{ backgroundColor: color }}
                    >
                      <span className="sr-only">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Quantity</h2>
              <div className="mt-2 flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                >
                  <span className="sr-only">Decrease quantity</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="text-lg font-medium text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                >
                  <span className="sr-only">Increase quantity</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex space-x-4">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 flex items-center justify-center space-x-2"
                onClick={handleAddToCart}
                disabled={!product.stock}
              >
                <FiShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToWishlist}
                className="flex items-center space-x-2"
              >
                <FiHeart className="h-5 w-5" />
                <span>Save</span>
              </Button>
            </div>

            {/* Shipping & Returns */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="flex items-center">
                  <FiTruck className="h-6 w-6 text-indigo-600" />
                  <p className="ml-2 text-sm text-gray-600">Free Shipping</p>
                </div>
                <div className="flex items-center">
                  <FiShield className="h-6 w-6 text-indigo-600" />
                  <p className="ml-2 text-sm text-gray-600">Secure Payment</p>
                </div>
                <div className="flex items-center">
                  <FiPackage className="h-6 w-6 text-indigo-600" />
                  <p className="ml-2 text-sm text-gray-600">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <ProductReviews productId={id} />
        </div>

        {/* Related Products */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <RelatedProducts
            productId={id}
            category={product.category}
            tags={product.tags}
          />
        </div>
      </div>
    </Container>
  )
}

export default ProductPage 