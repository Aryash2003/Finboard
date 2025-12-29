import { configureStore } from '@reduxjs/toolkit';
import widgetReducer from './slices/widgetSlice';
import { localStorageMiddleware, loadState } from './middleware/localStorage';

export const store = configureStore({
    reducer: {
        widgets: widgetReducer,
    },
    preloadedState: loadState(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
