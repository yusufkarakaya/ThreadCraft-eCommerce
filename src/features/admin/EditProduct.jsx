import { useEffect, useState } from 'react'
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useGetProductsQuery,
} from '../products/productsSlide'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const EditProduct = () => {
  const navigate = useNavigate()
  const { productId } = useParams()
  const {
    data: product,
    isLoading,
    isSuccess,
  } = useGetProductByIdQuery(productId)

  const [updateProduct, { isLoading: isUpdating, refetch }] =
    useUpdateProductMutation()

  const { data: products = [] } = useGetProductsQuery()

  const [formValues, setFormValues] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: '',
  })

  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (products?.entities) {
      // Extract category names from the entities object
      const categoriesArray = Object.values(products.entities)
        .map((product) => {
          if (product.category && product.category._id) {
            return {
              _id: product.category._id,
              name: product.category.name,
            }
          }
          return null
        })
        .filter((category) => category)
        .filter(
          (category, index, self) =>
            self.findIndex((c) => c._id === category._id) === index
        )

      setCategories(categoriesArray)
    }
  }, [products])

  useEffect(() => {
    if (product) {
      setFormValues({
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category?._id || '',
        description: product.description || '',
        image: product.imgUrl || '',
      })
    }
  }, [product])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    setFormValues((prev) => ({
      ...prev,
      image: e.target.files[0],
    }))
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', formValues.name)
    formData.append('price', Number(formValues.price))
    formData.append('category', formValues.category)
    formData.append('stock', Number(formValues.stock))
    formData.append('description', formValues.description)
    if (formValues.image) {
      formData.append('imageUrl', formValues.image)
    }
    try {
      await updateProduct({ id: productId, data: formData }).unwrap()
      console.log('Product updated successfully!')
      setTimeout(() => {
        navigate('/admin')
      }, 2000)
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="max-w-lg shadow-sm bg-white mx-auto rounded-lg mt-10 p-6">
      <h1 className="text-2xl text-center font-bold text-gray-700 mb-6">
        Update Product
      </h1>
      <form onSubmit={handleUpdateProduct} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="name" className="font-semibold text-gray-600">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            className="w-full border focus:border-transparent rounded-lg focus:ring-2 focus:border-blue-500 p-3 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="font-semibold text-gray-600">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formValues.price}
            onChange={handleInputChange}
            className="w-full border focus:border-transparent rounded-lg focus:ring-2 focus:border-blue-500 p-3 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="font-semibold text-gray-600">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formValues.stock}
            onChange={handleInputChange}
            className="w-full border focus:border-transparent rounded-lg focus:ring-2 focus:border-blue-500 p-3 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="font-semibold text-gray-600">
            Category
          </label>
          <select
            name="category"
            id="category"
            value={formValues.category}
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
          <label htmlFor="description" className="font-semibold text-gray-600">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            className="w-full border focus:border-transparent rounded-lg focus:ring-2 focus:border-blue-500 p-3 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="font-semibold text-gray-600">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="imageUrl"
            onChange={handleImageChange}
            className="w-full border focus:border-transparent rounded-lg focus:ring-2 focus:border-blue-500 p-3 focus:outline-none"
          />
        </div>

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300"
          type="submit"
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  )
}

export default EditProduct
