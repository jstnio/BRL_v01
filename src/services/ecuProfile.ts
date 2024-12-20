import axios from 'axios';

// API Configuration
const ECU_API_CONFIG = {
  baseUrl: 'https://apim.ecuworldwide.com',
  accountId: '519222',
  primaryKey: '368fdd35e9244dfdbeade0c8467e20f3'
};

// API Endpoints
const API_ENDPOINTS = {
  profile: '/profile/v1',
  user: '/profile/v1/user',
  branches: '/profile/v1/branches'
};

export interface EcuUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
}

export interface EcuBranch {
  id: number;
  ecuOfficeId: number;
  name: string;
  address: string;
  zip: string;
  location: string;
  country: {
    code: string;
    name: string;
  };
  isdCode: string;
  phone: string;
  fax: string;
  email: string;
}

const createApiInstance = () => {
  return axios.create({
    baseURL: ECU_API_CONFIG.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Ecuw-Api-Key': ECU_API_CONFIG.primaryKey,
      'Ocp-Apim-Subscription-Key': ECU_API_CONFIG.primaryKey,
      'Accept': 'application/json',
      'X-Account-Id': ECU_API_CONFIG.accountId
    }
  });
};

export const getUserProfile = async (): Promise<EcuUser> => {
  try {
    const api = createApiInstance();
    const response = await api.get(API_ENDPOINTS.user);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const getBranches = async (): Promise<EcuBranch[]> => {
  try {
    const api = createApiInstance();
    const response = await api.get(API_ENDPOINTS.branches);
    return response.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const getBranch = async (id: number, ecuOfficeId: number): Promise<EcuBranch> => {
  try {
    const api = createApiInstance();
    const response = await api.get(`${API_ENDPOINTS.branches}/${id}`, {
      params: { ecuOfficeId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching branch:', error);
    throw error;
  }
};
