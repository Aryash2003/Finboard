import React, { useState } from 'react';
import { Widget } from '@/types/widget';
import { CardView } from './CardView';
import { TableView } from './TableView';
import { ChartView } from './ChartView';

interface WidgetDetailModalProps {
    widget: Widget;
    data: any;
    onClose: () => void;
}

type ViewTab = 'card' | 'table' | 'chart';

export const WidgetDetailModal: React.FC<WidgetDetailModalProps> = ({
    widget,
    data,
    onClose,
}) => {
    const [activeTab, setActiveTab] = useState<ViewTab>('card');

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="w-full h-full max-w-[95vw] max-h-[95vh] bg-slate-900 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white">{widget.name}</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            {widget.endpoint} • Last updated: {new Date().toLocaleString()}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="ml-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 bg-slate-800/30">
                    <button
                        onClick={() => setActiveTab('card')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'card'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Card View
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab('table')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'table'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Table View
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab('chart')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'chart'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Chart View
                        </div>
                    </button>

                    <div className="flex-1" />

                    {/* Widget Info */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="capitalize">{widget.displayMode}</span>
                        </div>
                        {widget.refreshInterval > 0 && (
                            <div className="flex items-center gap-2 text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>{widget.refreshInterval}s</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-slate-900">
                    {activeTab === 'card' && (
                        <div className="h-full">
                            <CardView data={data} selectedFields={widget.selectedFields} />
                        </div>
                    )}

                    {activeTab === 'table' && (
                        <div className="h-full">
                            <TableView data={data} selectedFields={widget.selectedFields} />
                        </div>
                    )}

                    {activeTab === 'chart' && (
                        <div className="h-full p-6">
                            <ChartView
                                data={data}
                                selectedFields={widget.selectedFields}
                                chartType={widget.chartType || 'line'}
                            />
                        </div>
                    )}
                </div>

                {/* Footer with raw data toggle */}
                <div className="px-6 py-3 border-t border-slate-700 bg-slate-800/30">
                    <details className="group">
                        <summary className="cursor-pointer text-sm text-slate-400 hover:text-white flex items-center gap-2">
                            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            View Raw JSON Data
                        </summary>
                        <div className="mt-3 p-4 bg-slate-950 rounded-lg border border-slate-700 max-h-64 overflow-auto">
                            <pre className="text-xs text-slate-300">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );
};
