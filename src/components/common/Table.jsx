import React from 'react';

const Table = ({ headers, children, className = '' }) => {
    return (
        <div className={`overflow-x-auto rounded-xl border border-gray-100 ${className}`}>
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {children}
                </tbody>
            </table>
        </div>
    );
};

export const TableRow = ({ children, className = '', onClick }) => (
    <tr
        onClick={onClick}
        className={`hover:bg-gray-50/80 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
        {children}
    </tr>
);

export const TableCell = ({ children, className = '' }) => (
    <td className={`px-6 py-4 text-sm text-gray-600 ${className}`}>
        {children}
    </td>
);

export default Table;
