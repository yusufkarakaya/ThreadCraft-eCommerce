import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import {
  selectAllProducts,
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../products/productsSlide'

const AdminDashboard = () => {
  const { isLoading, isSuccess, isError, error, refetch } =
    useGetProductsQuery()

  const products = useSelector(selectAllProducts)

  const [deleteProduct] = useDeleteProductMutation()

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id).unwrap()
      console.log('Product deleted successfully')
    } catch (error) {
      console.error('Failed to delete the product: ', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  useEffect(() => {
    console.log(products)
  }, [products])

  let content = (
    <section className="p-10">
      <div className="flex mt-10 mb-6 gap-3">
        <Link to="/">
          <FaHome className="text-4xl text-main-text cursor-pointer" />
        </Link>
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      </div>
      <hr className="mb-10" />
      <section className="mb-10">
        <Link to="/admin/new-product" className="text-main-text">
          <button className="py-2 px-4 bg-main-text text-white hover:bg-green-950 transition-all ">
            Create New Product
          </button>
        </Link>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 border rounded-lg">
            <img
              src={`${product.images[0]}`}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold text-main-text">
              {product.name}
            </h3>
            <p className="text-main-text">${product.price} USD</p>
            <p className="text-main-text">
              Category: {product.category?.name || 'No category'}
            </p>
            <p className="text-main-text">Stock: {product.stock}</p>
            <div className="flex gap-5 justify-between mt-4">
              <Link to={`/admin/edit-product/${product.id}`}>
                <button className="py-2 px-6 bg-main-text text-white hover:bg-green-950 transition-all rounded-sm">
                  Edit
                </button>
              </Link>

              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="py-2 px-6 bg-red-900 text-white hover:bg-green-950 transition-all rounded-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  if (isSuccess) {
    return content
  }

  return null
}

export default AdminDashboard
