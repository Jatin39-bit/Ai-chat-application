import React from 'react';

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
};

const variants = {
  primary: 'bg-indigo-100 text-indigo-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
};

const Avatar = ({
  name,
  size = 'sm',
  variant = 'primary',
  className = '',
  ...props
}) => {
  // Get the first character of the name for the avatar
  const initials = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-medium
        ${sizes[size] || sizes.md}
        ${variants[variant] || variants.primary}
        ${className}
      `}
      {...props}
    >
      {initials}
    </div>
  );
};

export default Avatar; 