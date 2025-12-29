import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
    addWidget,
    removeWidget,
    updateWidget,
    reorderWidgets,
} from '@/store/slices/widgetSlice';
import { Widget } from '@/types/widget';

export const useWidgets = () => {
    const dispatch = useDispatch<AppDispatch>();
    const widgets = useSelector((state: RootState) => state.widgets.widgets);
    const widgetData = useSelector((state: RootState) => state.widgets.widgetData);
    const isLoading = useSelector((state: RootState) => state.widgets.isLoading);
    const error = useSelector((state: RootState) => state.widgets.error);

    const handleAddWidget = (widget: Widget) => {
        dispatch(addWidget(widget));
    };

    const handleRemoveWidget = (widgetId: string) => {
        dispatch(removeWidget(widgetId));
    };

    const handleUpdateWidget = (widget: Widget) => {
        dispatch(updateWidget(widget));
    };

    const handleReorderWidgets = (newWidgets: Widget[]) => {
        dispatch(reorderWidgets(newWidgets));
    };

    return {
        widgets,
        widgetData,
        isLoading,
        error,
        addWidget: handleAddWidget,
        removeWidget: handleRemoveWidget,
        updateWidget: handleUpdateWidget,
        reorderWidgets: handleReorderWidgets,
    };
};
