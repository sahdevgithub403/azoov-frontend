import React from 'react';

const Loader = ({ size = 'md', color = '#238898', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-t-transparent animate-spin rounded-full`}
        style={{ borderColor: `${color} transparent transparent transparent`, borderStyle: 'solid' }}
      ></div>
      <div
        className={`${sizes[size]} absolute border-gray-200 rounded-full opacity-20`}
        style={{ borderStyle: 'solid' }}
      ></div>
    </div>
  );
};

export default Loader;
