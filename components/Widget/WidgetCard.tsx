'use client';

import React, { useState } from 'react';
import { Widget, WidgetData } from '@/types/widget';
import { useWidgetData } from '@/hooks/useWidgetData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { formatDate } from '@/utils/dataFormatters';
import { WidgetDetailModal } from './WidgetDetailModal';

interface WidgetCardProps {
    widget: Widget;
    onRemove: () => void;
    onRefresh?: () => void;
    dragHandleProps?: any;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
    widget,
    onRemove,
    dragHandleProps,
}) => {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const { loading, refetch } = useWidgetData(widget);
    const widgetData = useSelector(
        (state: RootState) => state.widgets.widgetData?.[widget.id]
    );

    const handleRefresh = () => {
        refetch();
    };

    const handleExpand = () => {
        setShowDetailModal(true);
    };

    return (
        <>
            <div className="bg-slate-900 rounded-xl border border-slate-700 shadow-xl overflow-hidden hover:border-slate-600 transition-all">
                {/* Header */}
                <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
                    {/* Drag Handle */}
                    {dragHandleProps && (
                        <button
                            {...dragHandleProps}
                            className="p-2 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 mr-2"
                            title="Drag to reorder"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                        </button>
                    )}

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{widget.name}</h3>
                        {widgetData?.timestamp && (
                            <p className="text-xs text-slate-500 mt-0.5">
                                Last updated: {formatDate(widgetData.timestamp)}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Expand Button */}
                        <button
                            onClick={handleExpand}
                            className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Expand to full screen"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                />
                            </svg>
                        </button>

                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="p-2 text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
                            title="Refresh"
                        >
                            <svg
                                className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={onRemove}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                            title="Remove widget"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content - Simplified View */}
                <div className="p-6">
                    <div className="space-y-4">
                        {/* API Endpoint Info */}
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <svg
                                    className="w-5 h-5 text-emerald-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">API Endpoint</p>
                                <p className="text-sm text-slate-300 font-mono break-all">{widget.endpoint}</p>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        {loading ? (
                            <div className="flex items-center space-x-2 text-blue-400">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <span className="text-sm">Fetching data...</span>
                            </div>
                        ) : widgetData?.error ? (
                            <div className="flex items-center space-x-2 text-red-400">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                <span className="text-sm">Error: {widgetData.error}</span>
                            </div>
                        ) : widgetData?.data ? (
                            <div className="flex items-center space-x-2 text-emerald-400">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span className="text-sm">Data loaded successfully</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-slate-500">
                                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                <span className="text-sm">No data</span>
                            </div>
                        )}

                        {/* Expand hint */}
                        <div className="pt-2 border-t border-slate-700">
                            <p className="text-xs text-slate-500 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Click the expand icon to view detailed data
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Detail Modal */}
            {showDetailModal && widgetData?.data && (
                <WidgetDetailModal
                    widget={widget}
                    data={widgetData.data}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </>
    );
};
