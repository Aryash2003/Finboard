import React from 'react';
import { formatCurrency, formatNumber, formatDate } from '@/utils/dataFormatters';

interface CardViewProps {
    data: any;
    selectedFields: string[];
}

export const CardView: React.FC<CardViewProps> = ({ data, selectedFields }) => {
    const formatValue = (value: any, key: string): string => {
        if (value === null || value === undefined) return 'N/A';

        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'number') {
            if (key.toLowerCase().includes('price') || key.toLowerCase().includes('amount')
                || key.toLowerCase().includes('gain')) {
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

    const isUrl = (value: any): boolean => {
        return typeof value === 'string' && value.startsWith('http');
    };

    const renderPrimitiveValue = (value: any, key: string = ''): React.ReactNode => {
        if (value === null || value === undefined) {
            return <span className="text-slate-500 text-sm">N/A</span>;
        }

        if (isUrl(value)) {
            return (
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                >
                    View Link
                </a>
            );
        }

        const numValue = typeof value === 'number' ? value : null;
        const isPercentage = key.toLowerCase().includes('percent') ||
            key.toLowerCase().includes('change') ||
            key.toLowerCase().includes('gain');

        let colorClass = 'text-slate-200';
        if (isPercentage && numValue !== null) {
            colorClass = numValue > 0 ? 'text-emerald-400' : numValue < 0 ? 'text-red-400' : 'text-slate-200';
        }

        return <span className={`${colorClass} text-sm font-medium`}>{formatValue(value, key)}</span>;
    };

    const renderArrayAsCards = (items: any[], categoryName: string): React.ReactNode => {
        if (!items || items.length === 0) {
            return (
                <div className="text-center py-4 text-slate-500 text-sm">
                    No {categoryName.toLowerCase()} data available
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 
                                   hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 
                                   transition-all duration-200 overflow-hidden"
                    >
                        <div className="p-4 space-y-3">
                            {typeof item === 'object' && item !== null ? (
                                Object.entries(item).map(([key, value]) => {
                                    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                                        return null;
                                    }

                                    return (
                                        <div key={key} className="flex justify-between items-start gap-3">
                                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide flex-shrink-0">
                                                {formatKey(key)}:
                                            </span>
                                            <div className="flex-1 text-right">
                                                {renderPrimitiveValue(value, key)}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                renderPrimitiveValue(item, categoryName)
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderCategorySection = (categoryName: string, categoryData: any[]): React.ReactNode => {
        const count = categoryData?.length || 0;

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <h3 className="text-lg font-semibold text-white capitalize flex items-center gap-2">
                        {formatKey(categoryName)}
                        <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
                            {count} {count === 1 ? 'item' : 'items'}
                        </span>
                    </h3>
                </div>
                {renderArrayAsCards(categoryData, categoryName)}
            </div>
        );
    };

    const renderComplexObject = (obj: any): React.ReactNode => {
        const entries = Object.entries(obj);

        const arrayProperties = entries.filter(([_, value]) => Array.isArray(value));

        if (arrayProperties.length > 0) {
            return (
                <div className="space-y-8">
                    {arrayProperties.map(([key, value]) => (
                        <div key={key}>
                            {renderCategorySection(key, value as any[])}
                        </div>
                    ))}
                    {entries.filter(([_, value]) => !Array.isArray(value)).length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                            {entries
                                .filter(([_, value]) => !Array.isArray(value) && typeof value !== 'object')
                                .map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-400">
                                            {formatKey(key)}:
                                        </span>
                                        {renderPrimitiveValue(value, key)}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entries.map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1 p-3 bg-slate-800/30 rounded-lg">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                            {formatKey(key)}
                        </span>
                        <div className="mt-1">
                            {Array.isArray(value) ? (
                                renderArrayAsCards(value, key)
                            ) : typeof value === 'object' && value !== null ? (
                                <div className="text-sm">{renderComplexObject(value)}</div>
                            ) : (
                                renderPrimitiveValue(value, key)
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
            {Array.isArray(data) ? (
                renderArrayAsCards(data, 'items')
            ) : typeof data === 'object' && data !== null ? (
                renderComplexObject(data)
            ) : (
                <div className="text-slate-400">
                    {formatValue(data, '')}
                </div>
            )}
        </div>
    );
};
