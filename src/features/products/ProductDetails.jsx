import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectProductById, useGetProductByIdQuery } from './productsSlide'
import { useAddToCartMutation } from '../cart/cartApiSlice'
import { selectCurrentUser } from '../auth/authSlice'

const ProductDetails = () => {
  const { productId } = useParams()

  const user = useSelector(selectCurrentUser)

  const product = useSelector((state) => selectProductById(state, productId))

  const [quantity, setQuantity] = useState(1)
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()
  const [addSuccess, setAddSuccess] = useState(false)

  const {
    data: fetchedProduct,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId, {
    skip: !!product,
  })

  const handleAddToCart = async () => {
    if (productToDisplay.stock <= 0) {
      console.error('Product is out of stock')
      return
    }

    const payload = {
      productId: productId,
      quantity: Number(quantity),
      isGuest: !user
    }

    try {
      console.log('Adding to cart with payload:', payload)
      const result = await addToCart(payload).unwrap()
      console.log('Add to cart response:', result)
      setAddSuccess(true)
      setTimeout(() => setAddSuccess(false), 2000)
    } catch (error) {
      console.error('Failed to add product to cart:', error)
      if (error?.status === 404) {
        alert('Cart service is not available. Please try again later.')
      } else if (error?.data?.message) {
        alert(error.data.message)
      } else {
        alert('Failed to add product to cart. Please try again.')
      }
    }
  }

  const productToDisplay = product || fetchedProduct

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-900"></div>
      </div>
    )
  }

  if (isError || !productToDisplay) {
    return (
      <div className="text-center text-red-500 mt-10">Product not found</div>
    )
  }

  return (
    <div className="w-full pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center flex-col gap-5 ">
          {productToDisplay ? (
            productToDisplay.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={productToDisplay.name}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            ))
          ) : (
            <p>no image found</p>
          )}
        </div>
        <div className="flex flex-col">
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
          {user?.role === 'admin' ? (
            <p className="text-center text-blue-500 mt-4">You're admin</p>
          ) : (
            <div className="relative">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || productToDisplay.stock === 0}
                className={`bg-green-900 hover:bg-green-800 text-white py-3 px-6 rounded-lg mt-4 transition-all duration-300 ease-in-out w-full ${
                  isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              {addSuccess && (
                <div className="absolute top-0 left-0 right-0 -mt-8 text-center text-green-600">
                  Added to cart successfully!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
