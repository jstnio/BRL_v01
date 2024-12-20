import axios from 'axios';
import { config } from '../lib/config';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

const isTokenValid = () => {
  return cachedToken && tokenExpiration && Date.now() < tokenExpiration;
};

export const getMaerskToken = async (): Promise<string> => {
  if (isTokenValid()) {
    console.log('Using cached token');
    return cachedToken!;
  }

  try {
    console.log('Getting new Maersk token...');
    
    const tokenUrl = `${config.maersk.authUrl}/customer-identity/oauth/v2/token`;
    console.log('Token URL:', tokenUrl);
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', config.maersk.clientId);
    formData.append('client_secret', config.maersk.clientSecret);

    console.log('Request parameters:', {
      grant_type: 'client_credentials',
      client_id: config.maersk.clientId,
      // Hide client secret
      client_secret: '***'
    });

    const response = await axios.post<TokenResponse>(
      tokenUrl,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Consumer-Key': config.maersk.clientId,
          'Cache-Control': 'no-cache'
        },
        validateStatus: function (status) {
          return status < 500; // Resolve for any status less than 500
        }
      }
    );

    // Log response for debugging (without sensitive data)
    console.log('Token response status:', response.status);
    console.log('Token response headers:', {
      ...response.headers,
      authorization: undefined
    });
    
    if (response.status !== 200) {
      console.error('Token request failed:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      throw new Error(`Token request failed with status ${response.status}: ${JSON.stringify(response.data)}`);
    }

    if (!response.data.access_token) {
      console.error('No access token in response:', {
        ...response.data,
        access_token: undefined
      });
      throw new Error('Failed to get access token from response');
    }

    cachedToken = `${response.data.token_type} ${response.data.access_token}`;
    // Set expiration 5 minutes before actual expiry to be safe
    tokenExpiration = Date.now() + (response.data.expires_in - 300) * 1000;

    console.log('Successfully obtained new token');
    return cachedToken;
  } catch (error) {
    console.error('Error getting Maersk access token:', error);
    if (axios.isAxiosError(error)) {
      console.error('Token request failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: {
          ...error.response?.headers,
          authorization: undefined
        },
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: {
            ...error.config?.headers,
            authorization: undefined
          }
        }
      });
    }
    throw new Error('Failed to authenticate with Maersk API');
  }
};
