import axios from 'axios';
import { config } from '../lib/config';

const maerskApi = axios.create({
  baseURL: `${config.maersk.baseUrl}/track-and-trace-private`,
  headers: {
    'Consumer-Key': config.maersk.consumerKey,
    'Content-Type': 'application/json',
  },
});

export interface TrackingParams {
  carrierBookingReference?: string;
  transportDocumentReference?: string;
  equipmentReference?: string;
  eventType?: string[];
  limit?: number;
}

export const getTrackingEvents = async (params: TrackingParams) => {
  try {
    const response = await maerskApi.get('/events', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tracking events:', error);
    throw error;
  }
};