import React, { useState } from 'react';
import { formatCurrency, formatNumber, formatDate } from '@/utils/dataFormatters';

interface TableViewProps {
    data: any;
    selectedFields: string[];
}

export const TableView: React.FC<TableViewProps> = ({ data, selectedFields }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 20;

    const formatValue = (value: any, key: string): string => {
        if (value === null || value === undefined) return 'N/A';

        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'number') {
            if (key.toLowerCase().includes('price') || key.toLowerCase().includes('amount')) {
                return formatCurrency(value);
            }
            if (key.toLowerCase().includes('percent') || key.toLowerCase().includes('change')) {
                return `${value > 0 ? '+' : ''}${formatNumber(value)}%`;
            }
            return formatNumber(value);
        }
        if (typeof value === 'string') {
            if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
                return formatDate(value);
            }
            return value;
        }
        if (Array.isArray(value)) {
            return `[${value.length} items]`;
        }
        if (typeof value === 'object') {
            return '{...}';
        }

        return String(value);
    };

    const formatKey = (key: string): string => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const getValueColor = (value: any, key: string): string => {
        const numValue = typeof value === 'number' ? value : null;
        const isChange = key.toLowerCase().includes('change') ||
            key.toLowerCase().includes('gain') ||
            key.toLowerCase().includes('percent');

        if (isChange && numValue !== null) {
            return numValue > 0 ? 'text-emerald-400' : numValue < 0 ? 'text-red-400' : 'text-slate-300';
        }

        return 'text-slate-300';
    };

    // Process data - same logic as CardView
    // If data has nested arrays (categorized like IPO data), flatten all items
    let allItems: any[] = [];
    let categoryInfo: { [key: string]: number } = {};

    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
        const entries = Object.entries(data);
        const categoryArrays = entries.filter(([_, value]) => Array.isArray(value) && value.length > 0);

        if (categoryArrays.length > 0) {
            // Flatten all categories into single array, adding category field
            (categoryArrays as [string, any[]][]).forEach(([categoryName, items]) => {
                categoryInfo[categoryName] = items.length;
                items.forEach(item => {
                    allItems.push({
                        ...item,
                        _category: formatKey(categoryName)
                    });
                });
            });
        } else {
            // Single object - convert to array
            allItems = [data];
        }
    } else if (Array.isArray(data)) {
        // Already an array
        allItems = data;
    } else {
        allItems = [data];
    }

    // Filter data based on search
    const filteredData = searchTerm
        ? allItems.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase()))
        : allItems;

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Flatten objects one level deep and get all unique column keys
    const flattenItem = (item: any): any => {
        if (typeof item !== 'object' || item === null) {
            return item;
        }

        const flattened: any = {};

        Object.entries(item).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                flattened[key] = value;
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                // Flatten one level deep for objects
                Object.entries(value).forEach(([subKey, subValue]) => {
                    // Only include primitive values from nested objects
                    if (typeof subValue !== 'object' || subValue === null) {
                        flattened[`${key}.${subKey}`] = subValue;
                    }
                });
            } else if (!Array.isArray(value)) {
                // Include primitive values directly
                flattened[key] = value;
            }
        });

        return flattened;
    };

    // Flatten all items
    const flattenedData = paginatedData.map(flattenItem);

    // Get all unique keys from flattened data
    const allKeys = new Set<string>();
    flattenedData.forEach(item => {
        Object.keys(item).forEach(key => allKeys.add(key));
    });

    const columns = Array.from(allKeys).filter(key => key !== '_category');
    // Put _category first if it exists
    if (allKeys.has('_category')) {
        columns.unshift('_category');
    }

    if (flattenedData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-slate-800/30 rounded-lg border border-slate-700">
                <div className="text-center">
                    <p className="text-slate-400">No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search and Info */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search table..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {Object.keys(categoryInfo).length > 0 && (
                        <div className="flex gap-2">
                            {Object.entries(categoryInfo).map(([cat, count]) => (
                                <span key={cat} className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400">
                                    {cat}: {count}
                                </span>
                            ))}
                        </div>
                    )}
                    <span className="text-sm text-slate-400 whitespace-nowrap">
                        {filteredData.length} total {filteredData.length === 1 ? 'row' : 'rows'}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-700">
                <table className="w-full">
                    <thead className="bg-slate-800 border-b border-slate-700 sticky top-0">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {formatKey(column)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {flattenedData.map((item, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-slate-800/50 transition-colors">
                                {columns.map((column) => {
                                    const value = item[column];
                                    return (
                                        <td
                                            key={column}
                                            className={`px-4 py-3 text-sm ${getValueColor(value, column)} whitespace-nowrap`}
                                            title={String(value)}
                                        >
                                            {formatValue(value, column)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                        Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}
                    </p>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
