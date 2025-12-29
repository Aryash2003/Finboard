import { Middleware } from '@reduxjs/toolkit';

const STORAGE_KEY = 'finance_dashboard_state';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    // Only save to localStorage in browser environment
    if (typeof window !== 'undefined') {
        try {
            const state = store.getState();
            const stateToSave = {
                widgets: {
                    widgets: state.widgets.widgets,
                    // Don't persist widgetData to avoid storing large API responses
                }
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    return result;
};

export const loadState = (): any => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
        return undefined;
    }

    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState === null) {
            return undefined;
        }
        const parsed = JSON.parse(serializedState);

        // Ensure widgetData is always initialized
        if (parsed.widgets && !parsed.widgets.widgetData) {
            parsed.widgets.widgetData = {};
        }

        return parsed;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return undefined;
    }
};
