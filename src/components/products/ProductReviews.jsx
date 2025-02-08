import React, { useState } from 'react'
import { FiStar, FiThumbsUp, FiFlag } from 'react-icons/fi'
import { useGetProductReviewsQuery, useAddReviewMutation } from '../../features/products/productsSlice'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

const Rating = ({ value, onChange, interactive = false }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : 'span'}
          onClick={() => interactive && onChange(star)}
          className={`${
            interactive ? 'cursor-pointer hover:text-yellow-500' : ''
          } ${
            star <= value ? 'text-yellow-400' : 'text-gray-300'
          } transition-colors duration-200`}
          disabled={!interactive}
        >
          <FiStar
            className={`h-5 w-5 ${star <= value ? 'fill-current' : ''}`}
          />
        </button>
      ))}
    </div>
  )
}

const ProductReviews = ({ productId }) => {
  const { data: reviews, isLoading } = useGetProductReviewsQuery(productId)
  const [addReview] = useAddReviewMutation()

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  })

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    try {
      await addReview({
        productId,
        ...newReview,
      }).unwrap()
      setShowReviewForm(false)
      setNewReview({ rating: 5, comment: '' })
    } catch (err) {
      console.error('Failed to add review:', err)
    }
  }

  const averageRating =
    reviews?.reduce((acc, review) => acc + review.rating, 0) / reviews?.length || 0

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
          <div className="mt-2 flex items-center space-x-4">
            <Rating value={averageRating} />
            <span className="text-sm text-gray-500">
              Based on {reviews?.length || 0} reviews
            </span>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          Write a Review
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="space-y-4 bg-gray-50 p-6 rounded-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <Rating
              value={newReview.rating}
              onChange={(value) =>
                setNewReview((prev) => ({ ...prev, rating: value }))
              }
              interactive
            />
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Review
            </label>
            <textarea
              id="comment"
              rows={4}
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Share your experience with this product..."
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowReviewForm(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          {reviews?.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-200 pb-6 last:border-0"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {review.user.name}
                    </span>
                    <Badge variant="secondary" size="sm">
                      Verified Purchase
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <Rating value={review.rating} />
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-500">
                    <FiThumbsUp className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <FiFlag className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductReviews 