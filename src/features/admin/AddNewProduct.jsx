import { useState, useEffect } from 'react'
import {
  useAddNewProductMutation,
  useGetProductsQuery,
} from '../products/productsSlide'
import { useNavigate } from 'react-router-dom'

const AddNewProduct = () => {
  const navigate = useNavigate()

  const [addNewProduct, { isLoading, isSuccess, isError, error }] =
    useAddNewProductMutation()

  const { data: products = [], isLoading: isProductLoading } =
    useGetProductsQuery()

  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (products?.entities) {
      const categoriesArray = Object.values(products.entities)
        .map((product) => product.category)
        .filter(
          (category, index, self) =>
            category && index === self.findIndex((c) => c._id === category._id)
        )

      setCategories(categoriesArray)
    }
  }, [products])

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: null,
    category: '',
    stock: '',
    description: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      image: e.target.files[0],
    }))
  }

  const handleAddNewProduct = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', newProduct.name)
    formData.append('price', Number(newProduct.price))
    formData.append('category', newProduct.category)
    formData.append('stock', Number(newProduct.stock))
    formData.append('description', newProduct.description)
    if (newProduct.image) {
      formData.append('imageUrl', newProduct.image)
    }

    try {
      await addNewProduct(formData).unwrap()
      setNewProduct({
        name: '',
        price: '',
        image: '',
        category: '',
        stock: '',
        description: '',
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate('/admin')
      }, 2000)
    }
  }, [isSuccess, navigate])

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Add New Product
      </h1>

      {isError && (
        <p className="text-red-500 mb-4">Error: {error?.data?.message}</p>
      )}
      {isSuccess && (
        <p className="text-green-500 mb-4">Product added successfully!</p>
      )}

      <form onSubmit={handleAddNewProduct} encType="multipart/form-data">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold mb-2"
          >
            Product Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={newProduct.name}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 font-semibold mb-2"
          >
            Product Price
          </label>
          <input
            type="text"
            name="price"
            id="price"
            value={newProduct.price}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="imageUrl"
            className="block text-gray-700 font-semibold mb-2"
          >
            Product Image
          </label>
          <input
            type="file"
            name="imageUrl"
            id="imageUrl"
            onChange={handleImageChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-semibold mb-2"
          >
            Product Category
          </label>
          <select
            name="category"
            id="category"
            value={newProduct.category}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block text-gray-700 font-semibold mb-2"
          >
            Product Stock
          </label>
          <input
            type="text"
            name="stock"
            id="stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold mb-2"
          >
            Product Description
          </label>
          <textarea
            name="description"
            id="description"
            value={newProduct.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}

export default AddNewProduct
