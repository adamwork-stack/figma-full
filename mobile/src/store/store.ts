import {configureStore} from '@reduxjs/toolkit';
import {api} from '../services/api/apiClient';
import authReducer from './slices/authSlice';
import eventsReducer from './slices/eventsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
