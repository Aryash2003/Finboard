import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setWidgetData, setError } from '@/store/slices/widgetSlice';
import { ApiService } from '@/services/api';
import { Widget, WidgetData } from '@/types/widget';

export const useWidgetData = (widget: Widget) => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ApiService.fetchData({
                url: widget.endpoint,
                params: widget.parameters,
            });

            const widgetData: WidgetData = {
                widgetId: widget.id,
                data,
                timestamp: Date.now(),
            };

            dispatch(setWidgetData(widgetData));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';

            const widgetData: WidgetData = {
                widgetId: widget.id,
                data: null,
                timestamp: Date.now(),
                error: errorMessage,
            };

            dispatch(setWidgetData(widgetData));
            dispatch(setError(errorMessage));
        } finally {
            setLoading(false);
        }
    }, [widget, dispatch]);

    useEffect(() => {
        // Initial fetch
        fetchData();

        // Set up auto-refresh if interval is specified
        if (widget.refreshInterval > 0) {
            const interval = setInterval(fetchData, widget.refreshInterval * 1000);
            return () => clearInterval(interval);
        }
    }, [fetchData, widget.refreshInterval]);

    return { loading, refetch: fetchData };
};
