import { useEffect, useState } from 'react'
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useGetProductsQuery,
} from '../products/productsSlide'
import { useParams, useNavigate } from 'react-router-dom'

const EditProduct = () => {
  const navigate = useNavigate()
  const { productId } = useParams()
  const { data: product, isLoading } = useGetProductByIdQuery(productId)
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const { data: products = [] } = useGetProductsQuery()

  const [formValues, setFormValues] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    images: [],
  })

  const [newImages, setNewImages] = useState([]) // Store new images to be uploaded
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (products?.entities) {
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
        images: product.images || [],
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
    const files = Array.from(e.target.files)
    setNewImages((prev) => [...prev, ...files])
  }

  const handleDeleteImage = (imageUrl) => {
    setFormValues((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
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

    // Append new images to the form data
    newImages.forEach((image) => {
      formData.append('images', image)
    })

    // Append existing images to the form data
    formData.append('existingImages', JSON.stringify(formValues.images))

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
    <div className="max-w-screen-xl shadow-sm bg-white mx-auto rounded-lg mt-10 p-6">
      <h1 className="text-2xl text-center font-bold text-gray-700 mb-6">
        Update Product
      </h1>
      <form
        onSubmit={handleUpdateProduct}
        encType="multipart/form-data"
        className="flex gap-10"
      >
        <div>
          {/* Form Fields */}
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
              className="w-full border rounded-lg p-3"
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
              className="w-full border rounded-lg p-3"
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
              className="w-full border rounded-lg p-3"
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
              className="w-full border rounded-lg p-3"
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
              htmlFor="description"
              className="font-semibold text-gray-600"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg"
            type="submit"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>

        {/* Image Section */}
        <div>
          <div className="mb-4">
            <label htmlFor="image" className="font-semibold text-gray-600">
              Existing Images
            </label>
            <div className="flex gap-3 flex-wrap">
              {formValues.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`product-${index}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDeleteImage(image)}
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="newImages" className="font-semibold text-gray-600">
              Add New Images
            </label>
            <input
              type="file"
              id="newImages"
              name="newImages"
              multiple
              onChange={handleImageChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
