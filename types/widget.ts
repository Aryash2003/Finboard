// Widget types
export type DisplayMode = 'table' | 'card' | 'chart';
export type ChartType = 'line' | 'candlestick';

export interface Widget {
    id: string;
    name: string;
    endpoint: string;
    parameters: Record<string, string>;
    displayMode: DisplayMode;
    chartType?: ChartType;
    selectedFields: string[];
    refreshInterval: number; // in seconds
    lastUpdated?: number;
    order: number;
}

export interface WidgetData {
    widgetId: string;
    data: any;
    timestamp: number;
    error?: string;
}

// API Endpoint Configuration
export interface EndpointParameter {
    name: string;
    type: 'string' | 'number' | 'select';
    required: boolean;
    label: string;
    placeholder?: string;
    options?: string[];
    description?: string;
}

export interface ApiEndpoint {
    id: string;
    name: string;
    url: string;
    method: 'GET' | 'POST';
    parameters: EndpointParameter[];
    description: string;
    category: string;
}

// Redux State
export interface WidgetState {
    widgets: Widget[];
    widgetData: Record<string, WidgetData>;
    isLoading: boolean;
    error: string | null;
}
