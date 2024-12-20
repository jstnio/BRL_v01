import axios from 'axios';
import { config } from '../lib/config';
import { getMaerskToken } from './maerskAuth';
import { Event, ShipmentDetails } from '../types/maerskTracking';
import { getCurrentDate, formatDateForMaersk } from '../lib/timeUtils';

const createMaerskApi = async () => {
  const token = await getMaerskToken();
  
  return axios.create({
    baseURL: config.maersk.baseUrl,
    headers: {
      'Authorization': token.startsWith('Bearer') ? token : `Bearer ${token}`,
      'Consumer-Key': config.maersk.clientId,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
};

export interface ScheduleParams {
  countryCode?: string;
  cityName?: string;
  UNLocationCode?: string;
  carrierGeoID?: string;
  startDate?: string;
  dateRange?: string;
}

export interface OceanProduct {
  id: string;
  name: string;
  description: string;
  type: string;
}

export interface GetOceanProductsParams {
  vesselOperatorCarrierCode: string;
  collectionOriginCountryCode: string;
  collectionOriginCityName: string;
  collectionOriginUNRegionCode: string;
  deliveryDestinationCountryCode: string;
  deliveryDestinationCityName: string;
}

export const getOceanProducts = async (params: Partial<GetOceanProductsParams> = {}): Promise<OceanProduct[]> => {
  try {
    const api = await createMaerskApi();
    
    const requestParams = {
      vesselOperatorCarrierCode: 'MAEU',
      collectionOriginCountryCode: 'US',
      collectionOriginCityName: 'Houston',
      collectionOriginUNRegionCode: 'TX',
      deliveryDestinationCountryCode: 'NL',
      deliveryDestinationCityName: 'Rotterdam',
      ...params
    };

    const response = await api.get('/products/ocean-products', {
      params: requestParams,
      validateStatus: function (status) {
        return status < 500;
      }
    });

    if (response.status !== 200) {
      throw new Error(`Ocean products request failed with status ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error getting ocean products:', error);
    throw error;
  }
};

export interface TrackingEventsResponse {
  events: Event[];
  shipmentDetails?: ShipmentDetails;
}

const transformShipmentDetails = (data: any): ShipmentDetails | undefined => {
  if (!data) return undefined;

  // Extract shipment details from different possible response formats
  const shipment = data.shipment || data;
  if (!shipment) return undefined;

  // Extract container information from multiple possible locations
  const containers = [
    ...(shipment.containers || []),
    ...(shipment.equipment || []),
    ...(shipment.equipments || [])
  ].map((container: any) => ({
    containerNumber: container.containerNumber || container.id || container.equipmentReference || '',
    isoEquipmentCode: container.isoEquipmentCode || container.equipmentCode || container.ISOEquipmentCode,
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
    if (!trackingNumber) {
      throw new Error('Tracking number is required');
    }

    // Clean up tracking number (remove spaces, convert to uppercase)
    const cleanTrackingNumber = trackingNumber.trim().toUpperCase();
    
    const api = await createMaerskApi();

    console.log('Fetching tracking events for:', cleanTrackingNumber);

    // Try to fetch tracking information
    const response = await api.get('/shipment-tracking/v2/events', {
      params: {
        documentNumber: cleanTrackingNumber,
        type: 'TRANSPORT'
      },
      headers: {
        'Consumer-Key': config.maersk.clientId,
        'Cache-Control': 'no-cache'
      },
      validateStatus: function (status) {
        return status < 500; // Resolve for any status less than 500
      }
    });

    // Log the response status and data for debugging
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.status === 401) {
      console.error('Auth error details:', {
        headers: response.headers,
        data: response.data
      });
      throw new Error('Authentication failed. Please check your API credentials.');
    }

    if (response.status === 404) {
      throw new Error('No tracking information found for this reference number.');
    }

    if (response.status === 400) {
      console.error('Bad request details:', response.data);
      throw new Error('Invalid tracking reference number format.');
    }

    if (response.status !== 200) {
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(response.data)}`);
    }

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

    return { events, shipmentDetails };
  } catch (error) {
    console.error('Error fetching Maersk tracking events:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your API credentials.');
      } else if (error.response?.status === 404) {
        throw new Error('No tracking information found for this reference number.');
      } else if (error.response?.status === 400) {
        throw new Error(`Invalid tracking reference number format: ${JSON.stringify(error.response?.data)}`);
      }
    }
    throw error;
  }
};