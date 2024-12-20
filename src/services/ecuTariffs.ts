import axios from 'axios';
import { getUserProfile } from './ecuProfile';

// API Configuration
const ECU_API_CONFIG = {
  baseUrl: 'https://apim.ecuworldwide.com',
  accountId: 519222,
  primaryKey: '75b9b09f050c464da6425ee400c971a5',
  secondaryKey: '06a7bb5163814ad794990b13395b2ed8',
  subscriptionKey: '368fdd35e9244dfdbeade0c8467e20f3'
};

// API Endpoints
const API_ENDPOINTS = {
  tariffs: '/tariffs/v1'
};

export interface Location {
  unCode: string;
  countryCode: string;
  name: string;
  stateName: string;
}

export interface EcuOffice {
  id: string;
  name: string;
  address: string;
  zip: string;
  location: string;
  countryCode: string;
  isdCode: string;
  phone: string;
  fax: string;
  email: string;
}

export interface TariffRequest {
  product: string;     // Required: e.g., 'LCL', 'FCL'
  from: string;        // Required: UN Location code
  to: string;         // Required: UN Location code
  terms: 'prepaid' | 'collect';  // Required: only these two values allowed
  accountId: number;  // Required: Account ID as number
  valid_on?: string;  // Optional: RFC3339 date-time
  haz?: boolean;      // Optional: default false
  fr?: boolean;       // Optional: default false
}

export interface Tariff {
  accountName: string;
  traffic: string;
  bookingOffice: EcuOffice;
  pol: Location;
  polVia: Location;
  pod: Location;
}

const createApiInstance = () => {
  return axios.create({
    baseURL: ECU_API_CONFIG.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Ecuw-Api-Key': ECU_API_CONFIG.primaryKey,
      'Ocp-Apim-Subscription-Key': ECU_API_CONFIG.subscriptionKey,
      'Accept': 'application/json'
    }
  });
};

// Helper function to retry with secondary key if primary fails
const retryWithSecondaryKey = async (request: TariffRequest): Promise<Tariff[]> => {
  const api = axios.create({
    baseURL: ECU_API_CONFIG.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Ecuw-Api-Key': ECU_API_CONFIG.secondaryKey,
      'Ocp-Apim-Subscription-Key': ECU_API_CONFIG.subscriptionKey,
      'Accept': 'application/json'
    }
  });

  const response = await api.get(API_ENDPOINTS.tariffs, {
    params: {
      ...request,
      accountId: ECU_API_CONFIG.accountId,
      valid_on: request.valid_on || new Date().toISOString()
    }
  });
  return response.data;
};

export const fetchTariffs = async (request: TariffRequest): Promise<Tariff[]> => {
  try {
    // Validate terms
    if (request.terms !== 'prepaid' && request.terms !== 'collect') {
      throw new Error('Terms must be either "prepaid" or "collect"');
    }

    const api = createApiInstance();
    const response = await api.get(API_ENDPOINTS.tariffs, {
      params: {
        ...request,
        accountId: ECU_API_CONFIG.accountId,
        valid_on: request.valid_on || new Date().toISOString()
      }
    });
    return response.data;
  } catch (error) {
    if (error.message?.includes('Terms must be')) {
      throw error;
    }
    console.error('Error with primary key, trying secondary key:', error);
    try {
      // If primary key fails, try with secondary key
      return await retryWithSecondaryKey(request);
    } catch (retryError) {
      console.error('Error fetching tariffs with both keys:', retryError);
      throw retryError;
    }
  }
};
