import React from 'react';

const sizes = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const variants = {
  primary: 'text-indigo-600',
  white: 'text-white',
  secondary: 'text-gray-500',
  success: 'text-green-500',
  danger: 'text-red-500',
};

const Loader = ({ 
  size = 'md', 
  variant = 'primary', 
  className = '',
  fullScreen = false,
  ...props 
}) => {
  const loader = (
    <svg 
      className={`
        animate-spin ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}
      `}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader; 