import React from 'react'

const variants = {
  success: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30',
  warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30',
  error: 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/30',
  info: 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30',
  primary: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30',
  secondary: 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/30',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-glass',
}

const sizes = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-1.5 text-base',
  lg: 'px-4 py-2 text-lg',
}

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  dot = false,
  glow = false,
}) => {
  return (
    <span
      className={`
        inline-flex items-center justify-center font-medium
        rounded-full
        transition-all duration-300
        hover:scale-105 hover:shadow-xl
        backdrop-blur-sm
        ${variants[variant]}
        ${sizes[size]}
        ${glow ? 'animate-glow' : ''}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            inline-block w-2 h-2 rounded-full mr-1.5
            animate-pulse
            bg-current opacity-80
          `}
        />
      )}
      {children}
    </span>
  )
}

export default Badge 