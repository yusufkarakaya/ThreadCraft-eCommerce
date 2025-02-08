import React from 'react'
import { Link } from 'react-router-dom'

const Card = ({
  image,
  title,
  price,
  description,
  to,
  badge,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-white/10 backdrop-blur-lg
        rounded-2xl overflow-hidden
        border border-white/20
        transform transition-all duration-500
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20
        group relative
        ${className}
      `}
    >
      <div className="relative aspect-w-4 aspect-h-3">
        {badge && (
          <span className="absolute top-4 right-4 z-10 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
            {badge}
          </span>
        )}
        <Link to={to} className="absolute inset-0">
          <div className="w-full h-full overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
      </div>
      <div className="p-6">
        <Link to={to}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-300 line-clamp-1 group-hover:text-indigo-500">
            {title}
          </h3>
        </Link>
        {description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              ${parseFloat(price).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Free shipping</p>
          </div>
          {actions && (
            <div className="flex space-x-2 opacity-0 transform translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card 