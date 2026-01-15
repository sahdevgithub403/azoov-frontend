import React from 'react';

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error = '',
  icon: Icon,
  required = false,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={18} />
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-2.5 bg-white border ${error ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#238898] focus:ring-[#238898]/10'
            } rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all`}
        />
      </div>
      {error && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
