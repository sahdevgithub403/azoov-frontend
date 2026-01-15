import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-[#238898] text-white hover:bg-[#1d7380] shadow-lg shadow-[#238898]/20 focus:ring-[#238898]',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-100',
    outline: 'bg-transparent border-2 border-[#238898] text-[#238898] hover:bg-[#238898] hover:text-white focus:ring-[#238898]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
    icon: 'p-2'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <span className={`${children ? 'mr-2' : ''}`}><Icon size={18} /></span>}
      {children}
    </button>
  );
};

export default Button;
