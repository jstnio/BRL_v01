import axios from 'axios';
import { config } from '../lib/config';
import { getMaerskToken } from './maerskAuth';
import { Event, ShipmentEvent, TransportEvent, EquipmentEvent, ShipmentDetails } from '../types/maerskTracking';

const createMaerskApi = async () => {
  const token = await getMaerskToken();
  
  console.log('Creating Maersk API instance with token');
  
  return axios.create({
    baseURL: `${config.maersk.baseUrl}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Consumer-Key': config.maersk.clientId,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  });
};

export interface TrackingParams {
  carrierBookingReference?: string;
  transportDocumentReference?: string;
  equipmentReference?: string;
  eventType?: string[];
  limit?: number;
}

export interface TrackingEventsResponse {
  events: Event[];
  shipmentDetails?: ShipmentDetails;
}

const transformShipmentDetails = (data: any): ShipmentDetails | undefined => {
  if (!data) return undefined;

  // Extract shipment details from different possible response formats
  const shipment = data.shipment || data;
  if (!shipment) return undefined;

  console.log('Raw shipment data:', JSON.stringify(shipment, null, 2));

  // Extract container information from multiple possible locations
  const containers = [
    ...(shipment.containers || []),
    ...(shipment.equipment || []),
    ...(shipment.equipments || [])
  ].map((container: any) => ({
    containerNumber: container.containerNumber || container.id || container.equipmentReference || '',
    isoEquipmentCode: container.isoEquipmentCode || container.equipmentCode || container.ISOEquipmentCode,
    // Add any other container fields you need
  }));

  // Find the first departure and arrival events
  const events = shipment.events || [];
  const departureEvent = events.find((e: any) => e.transportEventTypeCode === 'DEPA');
  const arrivalEvent = events.find((e: any) => e.transportEventTypeCode === 'ARRI');

  // Extract vessel information from the first transport call that has it
  const firstTransportCall = events
    .map((e: any) => e.transportCall)
    .find((tc: any) => tc && tc.vessel);

  return {
    shipmentId: shipment.shipmentId || '',
    status: shipment.status || 'UNKNOWN',
    containers,
    actualDepartureDate: departureEvent?.eventDateTime,
    actualArrivalDate: arrivalEvent?.eventDateTime,
    vessel: firstTransportCall?.vessel
  };
};

const transformEvent = (event: any): Event => {
  const baseEvent = {
    eventID: event.eventID,
    eventType: event.eventType,
    eventDateTime: event.eventDateTime,
    eventCreatedDateTime: event.eventCreatedDateTime,
    eventClassifierCode: event.eventClassifierCode,
    transportEventTypeCode: event.transportEventTypeCode,
    documentReferences: event.documentReferences,
    transportCall: event.transportCall
  };

  return baseEvent as Event;
};

export const getTrackingEvents = async (trackingNumber: string): Promise<TrackingEventsResponse> => {
  try {
    console.log('Requesting Maersk tracking for:', trackingNumber);
    
    if (!trackingNumber) {
      throw new Error('Tracking number is required');
    }

    // Clean up tracking number (remove spaces, convert to uppercase)
    const cleanTrackingNumber = trackingNumber.trim().toUpperCase();
    
    const maerskApi = await createMaerskApi();
    
    // Try to fetch tracking information
    const response = await maerskApi.get('/shipment-tracking/v2/events', {
      params: {
        documentNumber: cleanTrackingNumber,
        type: 'TRANSPORT'
      }
    });

    console.log('Raw API Response:', response.data);

    let rawEvents = [];
    if (Array.isArray(response.data)) {
      rawEvents = response.data;
    } else if (response.data.events && Array.isArray(response.data.events)) {
      rawEvents = response.data.events;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      rawEvents = response.data.data;
    }

    const events = rawEvents.map(transformEvent);
    const shipmentDetails = transformShipmentDetails(response.data);

    console.log('Transformed Events:', JSON.stringify(events, null, 2));
    console.log('Transformed Shipment Details:', JSON.stringify(shipmentDetails, null, 2));

    return { events, shipmentDetails };
  } catch (error) {
    console.error('Error fetching Maersk tracking events:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          params: error.config?.params,
          baseURL: error.config?.baseURL
        }
      });

      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your API credentials.');
      } else if (error.response?.status === 404) {
        throw new Error('No tracking information found for this reference number.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid tracking reference number format.');
      }
    }
    throw error;
  }
};