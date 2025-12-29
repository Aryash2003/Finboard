import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Widget, WidgetData, WidgetState } from '@/types/widget';

const initialState: WidgetState = {
    widgets: [],
    widgetData: {},
    isLoading: false,
    error: null,
};

const widgetSlice = createSlice({
    name: 'widgets',
    initialState,
    reducers: {
        addWidget: (state, action: PayloadAction<Widget>) => {
            state.widgets.push(action.payload);
        },
        removeWidget: (state, action: PayloadAction<string>) => {
            state.widgets = state.widgets.filter(w => w.id !== action.payload);
            delete state.widgetData[action.payload];
        },
        updateWidget: (state, action: PayloadAction<Widget>) => {
            const index = state.widgets.findIndex(w => w.id === action.payload.id);
            if (index !== -1) {
                state.widgets[index] = action.payload;
            }
        },
        reorderWidgets: (state, action: PayloadAction<Widget[]>) => {
            state.widgets = action.payload;
        },
        setWidgetData: (state, action: PayloadAction<WidgetData>) => {
            state.widgetData[action.payload.widgetId] = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearWidgetData: (state, action: PayloadAction<string>) => {
            delete state.widgetData[action.payload];
        },
    },
});

export const {
    addWidget,
    removeWidget,
    updateWidget,
    reorderWidgets,
    setWidgetData,
    setLoading,
    setError,
    clearWidgetData,
} = widgetSlice.actions;

export default widgetSlice.reducer;
