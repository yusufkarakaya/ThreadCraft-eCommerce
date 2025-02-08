import React from 'react'
import { useGetRelatedProductsQuery } from '../../features/products/productsSlice'
import Card from '../ui/Card'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import Button from '../ui/Button'
import { useAddToCartMutation } from '../../features/cart/cartSlice'
import { useAddToWishlistMutation } from '../../features/wishlist/wishlistSlice'

const RelatedProducts = ({ productId, category, tags }) => {
  const { data: relatedProducts, isLoading } = useGetRelatedProductsQuery({
    productId,
    category,
    tags,
  })
  const [addToCart] = useAddToCartMutation()
  const [addToWishlist] = useAddToWishlistMutation()

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap()
    } catch (err) {
      console.error('Failed to add to cart:', err)
    }
  }

  const handleAddToWishlist = async (productId) => {
    try {
      await addToWishlist(productId).unwrap()
    } catch (err) {
      console.error('Failed to add to wishlist:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!relatedProducts?.length) {
    return null
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Related Products
      </h2>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <Card
            key={product._id}
            image={product.image}
            title={product.title}
            price={product.price}
            description={product.description}
            to={`/products/${product._id}`}
            badges={[
              product.stock <= 0 && { text: 'Out of Stock', variant: 'error' },
              product.isNew && { text: 'New', variant: 'success' },
              product.discount > 0 && {
                text: `${product.discount}% OFF`,
                variant: 'warning',
              },
            ].filter(Boolean)}
            actions={[
              <Button
                key="cart"
                variant="primary"
                size="sm"
                onClick={() => handleAddToCart(product._id)}
                disabled={product.stock <= 0}
              >
                <FiShoppingCart className="h-5 w-5" />
              </Button>,
              <Button
                key="wishlist"
                variant="outline"
                size="sm"
                onClick={() => handleAddToWishlist(product._id)}
              >
                <FiHeart className="h-5 w-5" />
              </Button>,
            ]}
          />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts 