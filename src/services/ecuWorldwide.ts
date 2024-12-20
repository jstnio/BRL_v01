import axios from 'axios';

// API Configuration
const ECU_API_CONFIG = {
  baseUrl: 'https://apim.ecuworldwide.com',
  accountId: '519222',
  primaryKey: '75b9b09f050c464da6425ee400c971a5',
  secondaryKey: '06a7bb5163814ad794990b13395b2ed8'
};

// API Endpoints
const API_ENDPOINTS = {
  tariffs: '/tariffs/v1',
  tracking: '/tracking/v1'
};

export interface TariffParams {
  product: string;
  from: string;
  to: string;
  terms: string;
  valid_on?: string;
  haz?: boolean;
  fr?: boolean;
}

export interface TariffResponse {
  // Add specific response type based on API documentation
  [key: string]: any;
}

export interface TrackingResponse {
  events: Array<{
    id: string;
    date: string;
    unLocation: {
      unCode: string;
      countryCode: string;
      name: string;
      stateName: string;
    };
    container?: {
      id: string;
      type: string;
    };
    voyage?: {
      voyageNumber: string;
      vessel: {
        name: string;
        imoNumber: string;
      };
      carrier: {
        scac: string;
        name: string;
      };
      arrival: string;
      departure: string;
    };
    comments?: string;
  }>;
  references: Array<{
    type: string;
    value: string;
  }>;
  routing: Array<{
    type: string;
    unLocation: {
      unCode: string;
      countryCode: string;
      name: string;
      stateName: string;
    };
    eta?: string;
    ata?: string;
    etd?: string;
    atd?: string;
  }>;
}

const createApiInstance = (useSecondaryKey = false) => {
  return axios.create({
    baseURL: ECU_API_CONFIG.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': useSecondaryKey ? ECU_API_CONFIG.secondaryKey : ECU_API_CONFIG.primaryKey,
      'Accept': 'application/json'
    }
  });
};

export const fetchTariffs = async (params: TariffParams): Promise<TariffResponse> => {
  try {
    // Try with primary key first
    try {
      const primaryApi = createApiInstance(false);
      const response = await primaryApi.get(API_ENDPOINTS.tariffs, {
        params: {
          ...params,
          accountId: ECU_API_CONFIG.accountId
        }
      });
      return response.data;
    } catch (primaryError: any) {
      // If primary key fails with 401, try secondary key
      if (primaryError.response?.status === 401) {
        console.log('Primary key failed, trying secondary key...');
        const secondaryApi = createApiInstance(true);
        const response = await secondaryApi.get(API_ENDPOINTS.tariffs, {
          params: {
            ...params,
            accountId: ECU_API_CONFIG.accountId
          }
        });
        return response.data;
      }
      throw primaryError;
    }
  } catch (error) {
    console.error('Error fetching tariffs:', error);
    throw error;
  }
};

export const fetchTracking = async (reference: string): Promise<TrackingResponse> => {
  try {
    // Try with primary key first
    try {
      const primaryApi = createApiInstance(false);
      const response = await primaryApi.get(API_ENDPOINTS.tracking, {
        params: { ref: reference }
      });
      return response.data;
    } catch (primaryError: any) {
      // If primary key fails with 401, try secondary key
      if (primaryError.response?.status === 401) {
        console.log('Primary key failed, trying secondary key...');
        const secondaryApi = createApiInstance(true);
        const response = await secondaryApi.get(API_ENDPOINTS.tracking, {
          params: { ref: reference }
        });
        return response.data;
      }
      throw primaryError;
    }
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    throw error;
  }
};
