import React from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const Input = ({
  label,
  name,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  showPasswordToggle = false,
  onTogglePassword,
  showPassword,
  ...props
}) => {
  const inputClasses = `
    block w-full px-4 py-3.5
    rounded-xl
    bg-white/5
    border-2 transition-all duration-300
    ${error
      ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:ring-rose-500 focus:border-rose-500'
      : 'border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500'
    }
    ${Icon ? 'pl-12' : ''}
    ${showPasswordToggle ? 'pr-12' : ''}
    backdrop-blur-sm
    shadow-xl shadow-black/5
    placeholder-gray-400
    focus:outline-none focus:ring-2 focus:bg-white/10
    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
    sm:text-sm
  `

  return (
    <div className={`group ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium mb-1.5 text-gray-700 group-focus-within:text-indigo-500 transition-colors duration-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" aria-hidden="true" />
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          className={inputClasses}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center focus:outline-none"
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-1.5 flex items-center space-x-1.5 text-sm text-rose-600">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

export default Input 