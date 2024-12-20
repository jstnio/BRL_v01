import axios from 'axios';
import { getUserProfile } from './ecuProfile';
import { searchLocations, Location } from './ecuCodes';

// API Configuration
const ECU_API_CONFIG = {
  baseUrl: 'https://apim.ecuworldwide.com',
  accountId: '519222',
  primaryKey: '368fdd35e9244dfdbeade0c8467e20f3'
};

// API Endpoints
const API_ENDPOINTS = {
  quotations: '/quotations/v1',
  locations: '/quotations/v1/codes/locations'
};

export interface QuoteDimension {
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
}

export interface QuotationRequest {
  weight: number;
  volume: number;
  poRUnCode: string;
  poDUnCode: string;
  productType: string;
  cargoClass: string;
  accountId: number;
  isHazardousMaterial: boolean;
  additionalServices?: string;
  currencyCode?: string;
  cargoReadyDate?: string;
  prepaidCollect?: string;
  fromType?: string;
  toType?: string;
  dimensionList?: QuoteDimension[];
}

export interface QuoteAdditionalService {
  additionalServiceId: string;
  additionalServiceIdGroup: string;
  isDefault: boolean;
  isSelected: boolean;
}

export interface QuoteOfferDetail {
  rate: number;
  userId: number;
  weight: number;
  volume: number;
  poRUnCode: string;
  poDUnCode: string;
  productType: string;
  cargoClass: string;
  isHazardousMaterial: boolean;
  currencyCode: string;
  cargoReadyDate: string;
  prepaidCollect: string;
  fromType: string;
  toType: string;
  quoteAdditionalServices: QuoteAdditionalService[];
}

export interface QuotationResponse {
  rate: number;
  userId: number;
  weight: number;
  volume: number;
  quoteOfferDetails: QuoteOfferDetail[];
}

const createApiInstance = async () => {
  try {
    // Get user profile first
    const userProfile = await getUserProfile();

    return axios.create({
      baseURL: ECU_API_CONFIG.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Ecuw-Api-Key': ECU_API_CONFIG.primaryKey,
        'Ocp-Apim-Subscription-Key': ECU_API_CONFIG.primaryKey,
        'Accept': 'application/json',
        'X-User-Id': userProfile.id.toString(),
        'X-Account-Id': ECU_API_CONFIG.accountId
      }
    });
  } catch (error) {
    console.error('Error creating API instance:', error);
    throw error;
  }
};

export const fetchQuotation = async (request: QuotationRequest): Promise<QuotationResponse[]> => {
  try {
    const api = await createApiInstance();
    const response = await api.post(API_ENDPOINTS.quotations, {
      ...request,
      accountId: ECU_API_CONFIG.accountId
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quotation:', error);
    throw error;
  }
};

export const fetchLocations = async (searchTerm: string): Promise<Location[]> => {
  try {
    // Use the codes service to search locations
    return await searchLocations({
      name: searchTerm,
      isPartialName: true
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};
