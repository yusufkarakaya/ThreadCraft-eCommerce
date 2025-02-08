import React, { useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi'
import { Dialog } from '@headlessui/react'

const ProductGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [touchStart, setTouchStart] = useState(null)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (!touchStart) return

    const currentTouch = e.touches[0].clientX
    const diff = touchStart - currentTouch

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrevious()
      }
      setTouchStart(null)
    }
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div
        className="relative aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <img
          src={images[currentIndex]}
          alt={`Product ${currentIndex + 1}`}
          className="h-full w-full object-cover object-center"
        />
        
        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 rounded-full bg-white/80 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
        >
          <FiZoomIn className="h-5 w-5" />
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg ${
                  index === currentIndex
                    ? 'ring-2 ring-indigo-500'
                    : 'ring-1 ring-gray-200'
                }`}
                style={{ width: '80px', height: '80px' }}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      <Dialog
        open={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/70" />

          <div className="relative mx-auto max-w-5xl">
            <div className="relative">
              <img
                src={images[currentIndex]}
                alt={`Product ${currentIndex + 1}`}
                className="h-full w-full object-contain"
              />

              {/* Navigation Arrows in Modal */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
                  >
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={() => setIsZoomOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
              >
                <span className="sr-only">Close zoom</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Thumbnails in Modal */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 w-2 rounded-full ${
                        index === currentIndex
                          ? 'bg-white'
                          : 'bg-white/50'
                      }`}
                    >
                      <span className="sr-only">
                        Go to slide {index + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ProductGallery 