import { create } from 'zustand';
import { getTrackingEvents } from '../services/maerskTrackingApi';
import { Event } from '../types/maerskTracking';

interface MaerskTrackingState {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: (params: {
    carrierBookingReference?: string;
    transportDocumentReference?: string;
    equipmentReference?: string;
  }) => Promise<void>;
}

export const useMaerskTrackingStore = create<MaerskTrackingState>((set) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (params) => {
    try {
      set({ loading: true, error: null });
      const response = await getTrackingEvents({
        ...params,
        limit: 100,
      });
      set({ events: response.events, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));