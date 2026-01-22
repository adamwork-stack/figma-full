import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Event} from '../../types/api';

interface EventsState {
  selectedEvent: Event | null;
  filters: {
    category?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  };
}

const initialState: EventsState = {
  selectedEvent: null,
  filters: {},
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
    setFilters: (state, action: PayloadAction<EventsState['filters']>) => {
      state.filters = {...state.filters, ...action.payload};
    },
    clearFilters: state => {
      state.filters = {};
    },
  },
});

export const {setSelectedEvent, setFilters, clearFilters} = eventsSlice.actions;
export default eventsSlice.reducer;
