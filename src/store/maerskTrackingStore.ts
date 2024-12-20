import create from 'zustand';
import { Event, ShipmentDetails } from '../types/maerskTracking';
import { getTrackingEvents } from '../services/maerskTrackingApi';

interface MaerskTrackingStore {
  events: Event[];
  shipmentDetails?: ShipmentDetails;
  loading: boolean;
  error: string | null;
  fetchEvents: (trackingNumber: string) => Promise<void>;
}

export const useMaerskTrackingStore = create<MaerskTrackingStore>((set) => ({
  events: [],
  shipmentDetails: undefined,
  loading: false,
  error: null,
  fetchEvents: async (trackingNumber: string) => {
    try {
      set({ loading: true, error: null });
      console.log('Fetching events for tracking number:', trackingNumber);
      
      const { events, shipmentDetails } = await getTrackingEvents(trackingNumber);
      
      set({ 
        events, 
        shipmentDetails,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      set({ 
        events: [], 
        shipmentDetails: undefined,
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred while fetching tracking information'
      });
    }
  }
}));