import React from 'react';
import Loader from './Loader';

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
};

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  icon = null,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center rounded-md font-medium shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        transition-colors duration-200 ease-in-out
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <Loader 
          size="xs" 
          variant={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : 'primary'} 
          className="-ml-1 mr-2"
        />
      )}
      {!isLoading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;