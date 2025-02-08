import React from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiShoppingCart } from 'react-icons/fi'
import { useGetWishlistQuery, useRemoveFromWishlistMutation, useClearWishlistMutation } from './wishlistSlice'
import { useAddToCartMutation } from '../cart/cartSlice'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const WishlistPage = () => {
  const { data: wishlist, isLoading } = useGetWishlistQuery()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()
  const [clearWishlist] = useClearWishlistMutation()
  const [addToCart] = useAddToCartMutation()

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId).unwrap()
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
    }
  }

  const handleClearWishlist = async () => {
    try {
      await clearWishlist().unwrap()
    } catch (err) {
      console.error('Failed to clear wishlist:', err)
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap()
    } catch (err) {
      console.error('Failed to add to cart:', err)
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
      <div className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          {wishlist?.items?.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="flex items-center space-x-2"
            >
              <FiTrash2 className="h-5 w-5" />
              <span>Clear Wishlist</span>
            </Button>
          )}
        </div>

        {!wishlist?.items?.length ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add items you love to your wishlist. Review them anytime and easily
              move them to the cart.
            </p>
            <Button to="/products" variant="primary">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.items.map((item) => (
              <Card
                key={item._id}
                image={item.image}
                title={item.title}
                price={item.price}
                description={item.description}
                to={`/products/${item._id}`}
                actions={[
                  <Button
                    key="cart"
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddToCart(item._id)}
                  >
                    <FiShoppingCart className="h-5 w-5" />
                  </Button>,
                  <Button
                    key="remove"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(item._id)}
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </Button>,
                ]}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

export default WishlistPage 