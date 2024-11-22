import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const productsAdapter = createEntityAdapter()

const initialState = productsAdapter.getInitialState()

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/api/products',
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,

      transformResponse: (responseData) => {
        const loadedProducts = responseData.map((product) => ({
          id: product._id,
          name: product.name,
          stock: product.stock,
          price: product.price,
          description: product.description,
          images: product.images,
          category: product.category,
        }))
        return productsAdapter.setAll(initialState, loadedProducts)
      },
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProductById: builder.query({
      query: (id) => `/api/products/${id}`,
      transformResponse: (responseData) => {
        return {
          id: responseData._id,
          name: responseData.name,
          stock: responseData.stock,
          price: responseData.price,
          images: responseData.images,
          category: responseData.category,
          description: responseData.description,
        }
      },
      providesTags: (result, error, arg) => [{ type: 'Product', id: arg }],
    }),
    addNewProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/api/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    deleteProductImage: builder.mutation({
      query: ({ productId, image }) => ({
        url: `/api/products/${productId}/images`,
        method: 'DELETE',
        body: { image },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddNewProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductImageMutation,
} = productsApiSlice

export const selectProductResult =
  productsApiSlice.endpoints.getProducts.select()

// Create memoized selector
const selectProductData = createSelector(
  selectProductResult,
  (productsResult) => productsResult?.data || initialState
)

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds,
} = productsAdapter.getSelectors(selectProductData)
