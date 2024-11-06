import { useGetProductsQuery } from './productsSlide'
import { useSelector } from 'react-redux'
import { selectAllProducts } from './productsSlide'
import { Link, useLocation } from 'react-router-dom'

const ProductList = () => {
  const { isLoading, isSuccess, isError, error } = useGetProductsQuery()
  const products = useSelector(selectAllProducts)
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const selectedCategory = queryParams.get('category')

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category?.name === selectedCategory)
    : products

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  if (isSuccess) {
    return (
      <section className="w-full pt-8 pb-8">
        <h2 className="text-3xl font-bold mb-4">
          {selectedCategory ? `Shop ${selectedCategory}` : 'Shop All'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 border rounded-lg">
              <Link to={`/product/${product.id}`}>
                <img
                  src={`${product.imgUrl}`}
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
                <button className="mt-4 bg-green-800 text-white py-2 w-full rounded-lg hover:bg-green-700 transition-all">
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
