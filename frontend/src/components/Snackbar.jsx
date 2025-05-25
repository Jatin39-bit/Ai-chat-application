import React, { useState, useEffect } from 'react';

const variants = {
  success: {
    icon: (
      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-green-50 border-green-200',
    titleClass: 'text-green-800',
    messageClass: 'text-green-700',
  },
  error: {
    icon: (
      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-red-50 border-red-200',
    titleClass: 'text-red-800',
    messageClass: 'text-red-700',
  },
  warning: {
    icon: (
      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-yellow-50 border-yellow-200',
    titleClass: 'text-yellow-800',
    messageClass: 'text-yellow-700',
  },
  info: {
    icon: (
      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-blue-50 border-blue-200',
    titleClass: 'text-blue-800',
    messageClass: 'text-blue-700',
  },
};

const positions = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
};

const Snackbar = ({
  open,
  autoHideDuration = 6000,
  onClose,
  variant = 'info',
  title,
  message,
  position = 'bottom-center',
  showCloseButton = true,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
    
    let timer;
    if (open && autoHideDuration) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoHideDuration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open, autoHideDuration, onClose]);

  if (!isVisible) return null;

  const variantStyle = variants[variant] || variants.info;
  const positionClass = positions[position] || positions['bottom-center'];

  return (
    <div 
      className={`fixed z-50 ${positionClass} flex items-start max-w-sm w-full transition-all duration-300 ease-in-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
    >
      <div className={`p-4 rounded-md shadow-lg border ${variantStyle.className} ${className} w-full`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {variantStyle.icon}
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <h3 className={`text-sm font-medium ${variantStyle.titleClass}`}>
                {title}
              </h3>
            )}
            {message && (
              <div className={`mt-1 text-sm ${variantStyle.messageClass}`}>
                {message}
              </div>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => {
                setIsVisible(false);
                if (onClose) onClose();
              }}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Snackbar; 