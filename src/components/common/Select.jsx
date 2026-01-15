import React from 'react';

const Select = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    error = '',
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
                <select
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full px-4 py-2.5 bg-white border ${error ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#238898] focus:ring-[#238898]/10'
                        } rounded-xl text-gray-700 focus:outline-none focus:ring-4 transition-all appearance-none`}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            </div>
            {error && <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
};

export default Select;
