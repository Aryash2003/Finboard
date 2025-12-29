'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { API_ENDPOINTS } from '@/config/api-endpoints';
import { ApiEndpoint, EndpointParameter, DisplayMode, ChartType, Widget } from '@/types/widget';
import { ApiService } from '@/services/api';
import toast from 'react-hot-toast';

interface AddWidgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (widget: Widget) => void;
}

type Step = 'config' | 'test' | 'fields';

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
    isOpen,
    onClose,
    onAdd,
}) => {
    const [step, setStep] = useState<Step>('config');
    const [widgetName, setWidgetName] = useState('');
    const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
    const [parameters, setParameters] = useState<Record<string, string>>({});
    const [displayMode, setDisplayMode] = useState<DisplayMode>('card');
    const [chartType, setChartType] = useState<ChartType>('line');
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [testData, setTestData] = useState<any>(null);
    const [testLoading, setTestLoading] = useState(false);
    const [selectedFields, setSelectedFields] = useState<string[]>([]);

    const resetForm = () => {
        setStep('config');
        setWidgetName('');
        setSelectedEndpoint(null);
        setParameters({});
        setDisplayMode('card');
        setChartType('line');
        setRefreshInterval(30);
        setTestData(null);
        setSelectedFields([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleEndpointSelect = (endpointId: string) => {
        const endpoint = API_ENDPOINTS.find(e => e.id === endpointId);
        if (endpoint) {
            setSelectedEndpoint(endpoint);
            // Initialize parameters
            const initialParams: Record<string, string> = {};
            endpoint.parameters.forEach(param => {
                initialParams[param.name] = param.placeholder || '';
            });
            setParameters(initialParams);
        }
    };

    const handleParameterChange = (paramName: string, value: string) => {
        setParameters(prev => ({
            ...prev,
            [paramName]: value,
        }));
    };

    const validateParameters = (): boolean => {
        if (!selectedEndpoint) return false;

        for (const param of selectedEndpoint.parameters) {
            if (param.required && !parameters[param.name]) {
                toast.error(`${param.label} is required`);
                return false;
            }
        }
        return true;
    };

    const handleTestConnection = async () => {
        if (!selectedEndpoint) return;
        if (!validateParameters()) return;

        setTestLoading(true);
        try {
            const data = await ApiService.fetchData({
                url: selectedEndpoint.url,
                params: parameters,
            });

            setTestData(data);
            toast.success('Connection successful!');

            // Auto-select first level fields
            if (data) {
                const fields = extractFields(data);
                setSelectedFields(fields.slice(0, 5)); // Select first 5 fields by default
            }

            setStep('fields');
        } catch (error) {
            toast.error('Connection failed. Please check your parameters.');
            console.error(error);
        } finally {
            setTestLoading(false);
        }
    };

    const extractFields = (data: any, prefix = ''): string[] => {
        const fields: string[] = [];

        if (Array.isArray(data) && data.length > 0) {
            return extractFields(data[0], prefix);
        }

        if (typeof data === 'object' && data !== null) {
            Object.keys(data).forEach(key => {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                fields.push(fullKey);
            });
        }

        return fields;
    };

    const toggleField = (field: string) => {
        setSelectedFields(prev =>
            prev.includes(field)
                ? prev.filter(f => f !== field)
                : [...prev, field]
        );
    };

    const handleAddWidget = () => {
        if (!widgetName.trim()) {
            toast.error('Please enter a widget name');
            return;
        }

        if (!selectedEndpoint) {
            toast.error('Please select an endpoint');
            return;
        }

        const newWidget: Widget = {
            id: `widget_${Date.now()}`,
            name: widgetName,
            endpoint: selectedEndpoint.url,
            parameters,
            displayMode,
            chartType: displayMode === 'chart' ? chartType : undefined,
            selectedFields: selectedFields.length > 0 ? selectedFields : extractFields(testData || {}),
            refreshInterval,
            order: Date.now(),
        };

        onAdd(newWidget);
        toast.success(`Widget "${widgetName}" added successfully!`);
        handleClose();
    };

    const categoryGroups = API_ENDPOINTS.reduce((acc, endpoint) => {
        if (!acc[endpoint.category]) {
            acc[endpoint.category] = [];
        }
        acc[endpoint.category].push(endpoint);
        return acc;
    }, {} as Record<string, ApiEndpoint[]>);

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add New Widget" size="lg">
            <div className="space-y-6">
                {/* Step 1: Configuration */}
                <div className="space-y-4">
                    <Input
                        label="Widget Name"
                        placeholder="e.g., Bitcoin Price Tracker"
                        value={widgetName}
                        onChange={(e) => setWidgetName(e.target.value)}
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Select API Endpoint
                        </label>
                        <select
                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            value={selectedEndpoint?.id || ''}
                            onChange={(e) => handleEndpointSelect(e.target.value)}
                        >
                            <option value="">Choose an endpoint...</option>
                            {Object.entries(categoryGroups).map(([category, endpoints]) => (
                                <optgroup key={category} label={category}>
                                    {endpoints.map(endpoint => (
                                        <option key={endpoint.id} value={endpoint.id}>
                                            {endpoint.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        {selectedEndpoint && (
                            <p className="mt-2 text-sm text-slate-400">{selectedEndpoint.description}</p>
                        )}
                    </div>

                    {/* Dynamic Parameters */}
                    {selectedEndpoint && selectedEndpoint.parameters.length > 0 && (
                        <div className="space-y-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <h3 className="text-sm font-semibold text-slate-300">API Parameters</h3>
                            {selectedEndpoint.parameters.map((param) => (
                                <div key={param.name}>
                                    {param.type === 'select' && param.options ? (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                {param.label} {param.required && <span className="text-red-400">*</span>}
                                            </label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                value={parameters[param.name] || ''}
                                                onChange={(e) => handleParameterChange(param.name, e.target.value)}
                                            >
                                                <option value="">Select {param.label}</option>
                                                {param.options.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <Input
                                            label={`${param.label} ${param.required ? '*' : ''}`}
                                            placeholder={param.placeholder}
                                            value={parameters[param.name] || ''}
                                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                                        />
                                    )}
                                    {param.description && (
                                        <p className="mt-1 text-xs text-slate-500">{param.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Chart Type if chart mode selected */}
                    {displayMode === 'chart' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Chart Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {(['line', 'candlestick'] as ChartType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setChartType(type)}
                                        className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${chartType === type
                                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                            : 'border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Refresh Interval */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Refresh Interval (seconds)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(Number(e.target.value))}
                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="mt-1 text-xs text-slate-500">Set to 0 to disable auto-refresh</p>
                    </div>
                </div>

                {/* Field Selection */}
                {step === 'fields' && testData && (
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-300 mb-3">
                            Select Fields to Display
                        </h3>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {extractFields(testData).map(field => (
                                <label
                                    key={field}
                                    className="flex items-center space-x-3 p-2 hover:bg-slate-700/50 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedFields.includes(field)}
                                        onChange={() => toggleField(field)}
                                        className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-slate-300 font-mono">{field}</span>
                                </label>
                            ))}
                        </div>
                        <p className="mt-3 text-xs text-slate-500">
                            {selectedFields.length} field(s) selected
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>

                    {step === 'config' && selectedEndpoint && (
                        <Button onClick={handleTestConnection} disabled={testLoading}>
                            {testLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Testing...
                                </span>
                            ) : (
                                'Test & Continue'
                            )}
                        </Button>
                    )}

                    {step === 'fields' && (
                        <Button onClick={handleAddWidget}>
                            Add Widget
                        </Button>
                    )}
                </div>

                {/* Test Data Preview */}
                {testData && (
                    <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-emerald-400">✓ Connection Successful</h4>
                            <span className="text-xs text-slate-500">Sample response</span>
                        </div>
                        <pre className="text-xs text-slate-400 overflow-auto max-h-32">
                            {JSON.stringify(testData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </Modal >
    );
};
