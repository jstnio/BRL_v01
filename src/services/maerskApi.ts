import axios from 'axios';
import { config } from '../lib/config';

const maerskApi = axios.create({
  baseURL: `${config.maersk.baseUrl}/schedules`,
  headers: {
    'Consumer-Key': config.maersk.consumerKey,
    'Content-Type': 'application/json',
  },
});

export interface ScheduleParams {
  countryCode?: string;
  cityName?: string;
  UNLocationCode?: string;
  carrierGeoID?: string;
  startDate?: string;
  dateRange?: string;
}

export const getActivePorts = async (countryCodes?: string[]) => {
  try {
    const params = countryCodes ? { countryCodes: countryCodes.join(','), carrierCodes: ['MAEU'] } : { carrierCodes: ['MAEU'] };
    const response = await maerskApi.get('/active-ports', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching active ports:', error);
    throw error;
  }
};

export const getActiveVessels = async () => {
  try {
    const response = await maerskApi.get('/active-vessels', { 
      params: { carrierCodes: ['MAEU'] }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching active vessels:', error);
    throw error;
  }
};

export const getPortSchedules = async (params: ScheduleParams) => {
  try {
    const response = await maerskApi.get('/port-calls', {
      params: {
        ...params,
        carrierCodes: ['MAEU']
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching port schedules:', error);
    throw error;
  }
};

export const getVesselSchedules = async (params: {
  vesselIMONumber?: string;
  carrierVesselCode?: string;
  startDate?: string;
  dateRange?: string;
}) => {
  try {
    const response = await maerskApi.get('/vessel-schedules', {
      params: {
        ...params,
        carrierCodes: ['MAEU']
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vessel schedules:', error);
    throw error;
  }
};