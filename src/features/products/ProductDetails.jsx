import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectProductById, useGetProductByIdQuery } from './productsSlide'
import { useAddToCartMutation } from '../cart/cartSlice'
import { selectUser } from '../auth/authSlice'

const ProductDetails = () => {
  const { productId } = useParams()

  const user = useSelector(selectUser)

  const product = useSelector((state) => selectProductById(state, productId))

  const [quantity, setQuantity] = useState(1)
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()

  const handleAddToCart = async () => {
    if (productToDisplay.stock <= 0) {
      console.error('Product is out of stock')
      return
    }

    const payload = {
      product: productToDisplay.id,
      quantity,
    }

    try {
      await addToCart(payload).unwrap()
    } catch (error) {
      console.error('Failed to add product to cart:', error)
    }
  }

  const {
    data: fetchedProduct,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId, {
    skip: !!product,
  })

  const productToDisplay = product || fetchedProduct

  if (isLoading) return <div>Loading...</div>

  if (isError || !productToDisplay) {
    return (
      <div className="text-center text-red-500 mt-10">Product not found</div>
    )
  }

  return (
    <div className="w-full pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <img
            src={`${productToDisplay.imgUrl}`}
            alt={productToDisplay.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {productToDisplay.name}
          </h1>

          <p className="text-xl text-gray-500 mb-6">
            Category:{' '}
            <span className="text-gray-800">
              {typeof productToDisplay.category === 'object'
                ? productToDisplay.category.name
                : productToDisplay.category || 'No Category'}
            </span>
          </p>

          <p className="text-2xl text-green-600 font-semibold mb-6">
            ${productToDisplay.price}
          </p>

          <p className="text-gray-600 mb-6">
            {productToDisplay.description || 'No description available.'}
          </p>

          <p className="text-lg text-gray-800 mb-2">
            <strong>Stock: </strong>
            {productToDisplay.stock > 0 ? (
              <span className="text-green-600">
                In Stock ({productToDisplay.stock})
              </span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-lg text-gray-800 mb-2"
            >
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={productToDisplay.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {user ? (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || productToDisplay.stock === 0}
              className={`bg-green-900 hover:bg-green-800 text-white py-3 px-6 rounded-lg mt-4 transition-all duration-300 ease-in-out ${
                isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          ) : (
            <p className="text-center text-red-500 mt-4">
              Please login to add this item to your cart
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
