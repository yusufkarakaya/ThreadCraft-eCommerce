import React, { useState } from 'react'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { Dialog, Disclosure } from '@headlessui/react'
import { useSearchProductsQuery } from '../../features/products/productsSlice'
import Button from '../ui/Button'
import Input from '../ui/Input'

const filters = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'books', label: 'Books' },
      { value: 'home', label: 'Home & Garden' },
    ],
  },
  {
    id: 'price',
    name: 'Price Range',
    options: [
      { value: '0-50', label: 'Under $50' },
      { value: '50-100', label: '$50 to $100' },
      { value: '100-200', label: '$100 to $200' },
      { value: '200+', label: 'Over $200' },
    ],
  },
  {
    id: 'rating',
    name: 'Rating',
    options: [
      { value: '4+', label: '4 Stars & Up' },
      { value: '3+', label: '3 Stars & Up' },
      { value: '2+', label: '2 Stars & Up' },
      { value: '1+', label: '1 Star & Up' },
    ],
  },
]

const AdvancedSearch = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({})
  const [sortBy, setSortBy] = useState('relevance')

  const { data: searchResults, isLoading } = useSearchProductsQuery(
    {
      searchTerm,
      filters: selectedFilters,
      sortBy,
    },
    {
      skip: !searchTerm,
    }
  )

  const handleFilterChange = (filterId, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({})
    setSortBy('relevance')
  }

  return (
    <div className="relative">
      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={FiSearch}
          className="w-full"
        />
        <Button
          variant="outline"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => setIsOpen(true)}
        >
          <FiFilter className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="relative mx-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Advanced Search
            </Dialog.Title>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-6 w-6" />
            </button>

            <div className="mt-6 space-y-6">
              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Filter Groups */}
              <div className="space-y-4">
                {filters.map((filter) => (
                  <Disclosure key={filter.id} as="div">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100">
                          <span>{filter.name}</span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <FiMinus className="h-5 w-5" />
                            ) : (
                              <FiPlus className="h-5 w-5" />
                            )}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2">
                          <div className="space-y-2">
                            {filter.options.map((option) => (
                              <label
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedFilters[filter.id] === option.value
                                  }
                                  onChange={() =>
                                    handleFilterChange(filter.id, option.value)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button variant="primary" onClick={() => setIsOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Search Results */}
      {searchTerm && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              </div>
            ) : searchResults?.length === 0 ? (
              <p className="text-center text-gray-500">No results found</p>
            ) : (
              <ul className="space-y-2">
                {searchResults?.map((product) => (
                  <li
                    key={product._id}
                    className="flex items-center space-x-4 rounded-lg p-2 hover:bg-gray-50"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      to={`/products/${product._id}`}
                    >
                      View
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedSearch 