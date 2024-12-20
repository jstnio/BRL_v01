import axios from 'axios';

// API Configuration
const ECU_API_CONFIG = {
  baseUrl: 'https://apim.ecuworldwide.com',
  primaryKey: '368fdd35e9244dfdbeade0c8467e20f3'
};

// API Endpoints
const API_ENDPOINTS = {
  codes: '/codes/v1',
  locations: '/codes/v1/locations',
  freightTerms: '/codes/v1/freightterms',
  warehouses: '/codes/v1/warehouses',
  maxDimensions: '/codes/v1/maxdimensions'
};

export interface Location {
  unCode: string;
  countryCode: string;
  name: string;
  stateName: string;
}

export interface FreightTerm {
  id: string;
  name: string;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
}

export interface MaxDimension {
  length: number;
  width: number;
  height: number;
  weight: number;
}

const createApiInstance = () => {
  return axios.create({
    baseURL: ECU_API_CONFIG.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Ecuw-Api-Key': ECU_API_CONFIG.primaryKey,
      'Ocp-Apim-Subscription-Key': ECU_API_CONFIG.primaryKey,
      'Accept': 'application/json'
    }
  });
};

export const searchLocations = async (params: {
  country?: string;
  name?: string;
  isPartialName?: boolean;
}): Promise<Location[]> => {
  try {
    const api = createApiInstance();
    const response = await api.get(API_ENDPOINTS.locations, { params });
    return response.data;
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

export const getLocationByUnCode = async (unCode: string): Promise<Location> => {
  try {
    const api = createApiInstance();
    const response = await api.get(`${API_ENDPOINTS.locations}/${unCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
};

export const getFreightTerms = async (): Promise<FreightTerm[]> => {
  try {
    const api = createApiInstance();
    const response = await api.get(API_ENDPOINTS.freightTerms);
    return response.data;
  } catch (error) {
    console.error('Error fetching freight terms:', error);
    throw error;
  }
};

export const getWarehouses = async (): Promise<Warehouse[]> => {
  try {
    const api = createApiInstance();
    const response = await api.get(API_ENDPOINTS.warehouses);
    return response.data;
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    throw error;
  }
};

export const getMaxDimensions = async (): Promise<MaxDimension[]> => {
  try {
    const api = createApiInstance();
    const response = await api.get(API_ENDPOINTS.maxDimensions);
    return response.data;
  } catch (error) {
    console.error('Error fetching max dimensions:', error);
    throw error;
  }
};

// Codes Service
const CODES_API_CONFIG = {
  baseUrl: 'https://apim.ecuworldwide.com/codes/v1',
  primaryKey: '368fdd35e9244dfdbeade0c8467e20f3'
};

const createCodesApiInstance = () => {
  return axios.create({
    baseURL: CODES_API_CONFIG.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Ecuw-Api-Key': CODES_API_CONFIG.primaryKey,
      'Accept': 'application/json'
    }
  });
};

export const searchLocationsCodes = async (searchTerm?: string, countryCode?: string): Promise<Location[]> => {
  try {
    const api = createCodesApiInstance();
    const response = await api.get('/locations/cfs', {
      params: {
        name: searchTerm,
        country: countryCode
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching locations codes:', error);
    throw error;
  }
};

export const getLocationByUnCodeCodes = async (unCode: string): Promise<Location> => {
  try {
    const api = createCodesApiInstance();
    const response = await api.get(`/locations/cfs/${unCode}`);
    return response.data;
  } catch (error) {
    console.error('Error getting location codes:', error);
    throw error;
  }
};
