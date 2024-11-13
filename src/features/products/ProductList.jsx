import { useGetProductsQuery } from './productsSlide'
import { useSelector } from 'react-redux'
import { selectAllProducts } from './productsSlide'
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const ProductList = () => {
  const { isLoading, isSuccess, isError, error, refetch } =
    useGetProductsQuery()
  const products = useSelector(selectAllProducts)
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const selectedCategory = queryParams.get('category')

  // Filter products by category and validate each product
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category?.name === selectedCategory)
    : products

  // Validation function to check if required fields exist
  const isValidProduct = (product) => {
    return (
      product &&
      product.name &&
      product.price !== undefined &&
      product.images &&
      product.images.length > 0
    )
  }

  // Filter out invalid products
  const validProducts = filteredProducts.filter(isValidProduct)

  // Debugging logs to check states and data
  useEffect(() => {
    console.log('Loading:', isLoading)
    console.log('Success:', isSuccess)
    console.log('Error:', isError)
    console.log('Products:', products)
    console.log('Filtered Products:', filteredProducts)
    console.log('Valid Products:', validProducts)
  }, [isLoading, isSuccess, isError, products, filteredProducts, validProducts])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    console.error('Fetch error:', error) // Log the error details for debugging
    return (
      <div className="text-center text-red-500 mt-10">
        <p>
          Error loading products:{' '}
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={refetch}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    )
  }

  if (isSuccess && (!validProducts || validProducts.length === 0)) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p>
          No products found or some products are missing required information.
        </p>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <section className="w-full pt-8 pb-8">
        <h2 className="text-3xl font-bold mb-4">
          {selectedCategory ? `Shop ${selectedCategory}` : 'Shop All'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {validProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 border rounded-lg hover:scale-95 transition-all duration-300"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-auto object-cover cursor-pointer"
                />
              </Link>
              <Link to={`/product/${product.id}`}>
                <h3 className="mt-4 text-lg font-semibold text-main-text hover:underline-offset-2 hover:underline cursor-pointer transition-all">
                  {product.name}
                </h3>
              </Link>
              <p className="text-main-text">${product.price} USD</p>
              <Link to={`/product/${product.id}`}>
                <button className="mt-4 bg-green-900 text-white py-2 w-full rounded-lg hover:bg-green-800 transition-all duration-200">
                  Product Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return null
}

export default ProductList
