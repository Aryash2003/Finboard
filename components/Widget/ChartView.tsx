import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import { ChartType } from '@/types/widget';

interface ChartViewProps {
    data: any;
    selectedFields: string[];
    chartType: ChartType;
}

export const ChartView: React.FC<ChartViewProps> = ({
    data,
    selectedFields,
    chartType,
}) => {
    // Extract all numeric fields from data recursively
    const extractNumericData = (obj: any, prefix: string = ''): { key: string; value: number; label: string }[] => {
        const results: { key: string; value: number; label: string }[] = [];

        if (typeof obj === 'number') {
            return [{ key: prefix, value: obj, label: prefix }];
        }

        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                if (typeof item === 'number') {
                    results.push({
                        key: `${prefix}[${index}]`,
                        value: item,
                        label: `Item ${index + 1}`
                    });
                } else if (typeof item === 'object' && item !== null) {
                    const nested = extractNumericData(item, `[${index}]`);
                    results.push(...nested);
                }
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
                const newPrefix = prefix ? `${prefix}.${key}` : key;

                if (typeof value === 'number') {
                    results.push({
                        key: newPrefix,
                        value: value,
                        label: formatLabel(key)
                    });
                } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // Only go one level deep for objects to avoid too much nesting
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        if (typeof subValue === 'number') {
                            results.push({
                                key: `${newPrefix}.${subKey}`,
                                value: subValue,
                                label: `${formatLabel(key)} - ${formatLabel(subKey)}`
                            });
                        }
                    });
                }
            });
        }

        return results;
    };

    const formatLabel = (key: string): string => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    // Prepare chart data
    const chartData = useMemo(() => {
        // Handle nested JSON with categories (like IPO data)
        if (typeof data === 'object' && !Array.isArray(data)) {
            const categoryArrays = Object.entries(data).filter(([_, value]) => Array.isArray(value)) as [string, any[]][];

            if (categoryArrays.length > 0) {
                // Create chart from categorized data
                const chartItems: any[] = [];

                categoryArrays.forEach(([categoryName, items]) => {
                    items.forEach((item, index) => {
                        const chartItem: any = {
                            name: `${formatLabel(categoryName)} ${index + 1}`,
                            category: formatLabel(categoryName),
                        };

                        // Extract numeric fields
                        Object.entries(item).forEach(([key, value]) => {
                            if (typeof value === 'number') {
                                chartItem[key] = value;
                            } else if (typeof value === 'string') {
                                // Try to parse numeric strings
                                const numValue = parseFloat(value);
                                if (!isNaN(numValue)) {
                                    chartItem[key] = numValue;
                                }
                            }
                        });

                        // Only add if has numeric data
                        if (Object.keys(chartItem).length > 2) {
                            chartItems.push(chartItem);
                        }
                    });
                });

                return {
                    data: chartItems.slice(0, 50), // Limit to 50 items for performance
                    fields: Array.from(new Set(
                        chartItems.flatMap(item =>
                            Object.keys(item).filter(k => k !== 'name' && k !== 'category' && typeof item[k] === 'number')
                        )
                    )).slice(0, 8) // Limit to 8 fields for readability
                };
            }
        }

        // Handle simple array data
        if (Array.isArray(data)) {
            const processedData = data.slice(0, 50).map((item, index) => {
                const chartItem: any = {
                    name: `Item ${index + 1}`,
                    index: index
                };

                if (typeof item === 'object' && item !== null) {
                    // Extract numeric fields
                    Object.entries(item).forEach(([key, value]) => {
                        if (typeof value === 'number') {
                            chartItem[key] = value;
                        } else if (typeof value === 'string') {
                            const numValue = parseFloat(value);
                            if (!isNaN(numValue)) {
                                chartItem[key] = numValue;
                            }
                        }
                    });
                }

                return chartItem;
            });

            const fields = Array.from(new Set(
                processedData.flatMap(item =>
                    Object.keys(item).filter(k => k !== 'name' && k !== 'index' && typeof item[k] === 'number')
                )
            )).slice(0, 8);

            return { data: processedData, fields };
        }

        // Handle single object - extract all numeric fields
        if (typeof data === 'object' && data !== null) {
            const numericData = extractNumericData(data);

            if (numericData.length > 0) {
                return {
                    data: numericData.slice(0, 20).map(item => ({
                        name: item.label,
                        value: item.value
                    })),
                    fields: ['value']
                };
            }
        }

        return { data: [], fields: [] };
    }, [data, selectedFields]);

    if (chartData.data.length === 0) {
        return (
            <div className="flex items-center justify-center h-80 bg-slate-800/30 rounded-lg border border-slate-700">
                <div className="text-center p-8">
                    <svg
                        className="w-16 h-16 text-slate-600 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    <p className="text-slate-400 font-medium mb-2">No Numeric Data Available</p>
                    <p className="text-sm text-slate-500 max-w-md">
                        The selected data doesn't contain numeric values suitable for charting.
                        Try selecting different fields or use Table/Card view instead.
                    </p>
                </div>
            </div>
        );
    }

    const colors = [
        '#10b981', // emerald
        '#3b82f6', // blue
        '#f59e0b', // amber
        '#ef4444', // red
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#14b8a6', // teal
        '#f97316', // orange
    ];

    return (
        <div className="space-y-4">
            {/* Chart Info */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">
                        <span className="font-semibold text-emerald-400">{chartData.data.length}</span> data points
                    </span>
                    <span className="text-sm text-slate-400">
                        <span className="font-semibold text-emerald-400">{chartData.fields.length}</span> numeric fields
                    </span>
                </div>
                <div className="text-xs text-slate-500">
                    {chartType === 'line' ? '📈 Line Chart' : '📊 Bar Chart'}
                </div>
            </div>

            {/* Chart */}
            <div className="h-96 w-full bg-slate-900/50 rounded-lg border border-slate-700 p-4">
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                        <LineChart data={chartData.data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                style={{ fontSize: '11px' }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                style={{ fontSize: '11px' }}
                                width={60}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '12px'
                                }}
                                formatter={(value: any) => {
                                    if (typeof value === 'number') {
                                        return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
                                    }
                                    return value;
                                }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }}
                                iconType="line"
                            />
                            {chartData.fields.map((field, index) => (
                                <Line
                                    key={field}
                                    type="monotone"
                                    dataKey={field}
                                    stroke={colors[index % colors.length]}
                                    strokeWidth={2}
                                    dot={{ fill: colors[index % colors.length], r: 3 }}
                                    activeDot={{ r: 5 }}
                                    name={formatLabel(field)}
                                />
                            ))}
                        </LineChart>
                    ) : (
                        <BarChart data={chartData.data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                style={{ fontSize: '11px' }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                style={{ fontSize: '11px' }}
                                width={60}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '12px'
                                }}
                                formatter={(value: any) => {
                                    if (typeof value === 'number') {
                                        return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
                                    }
                                    return value;
                                }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }}
                                iconType="square"
                            />
                            {chartData.fields.map((field, index) => (
                                <Bar
                                    key={field}
                                    dataKey={field}
                                    fill={colors[index % colors.length]}
                                    radius={[4, 4, 0, 0]}
                                    name={formatLabel(field)}
                                />
                            ))}
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Legend/Field Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {chartData.fields.map((field, index) => (
                    <div
                        key={field}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-xs text-slate-300 truncate">{formatLabel(field)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
