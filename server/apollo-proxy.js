import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;
const APOLLO_API_KEY = 'NrgAPcGW3-r_PjP8r0V9bQ';

// Create an axios instance with default config
const apolloClient = axios.create({
  baseURL: 'https://api.apollo.io/api/v1',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5174',
  methods: ['GET', 'POST', 'OPTIONS']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/apollo/search', async (req, res) => {
  console.log('Received search request with params:', JSON.stringify(req.body, null, 2));
  
  try {
    // Prepare the request payload
    const apolloPayload = {
      api_key: APOLLO_API_KEY,
      ...req.body
    };

    console.log('Sending request to Apollo API with payload:', JSON.stringify(apolloPayload, null, 2));

    const apolloResponse = await apolloClient.post('/people/search', apolloPayload);

    console.log('Apollo API response status:', apolloResponse.status);
    console.log('Apollo API response data:', JSON.stringify(apolloResponse.data, null, 2));

    // Check if we have people in the response
    const people = apolloResponse.data?.people || [];
    console.log(`Found ${people.length} contacts in the response`);
    
    res.json({
      people,
      total: apolloResponse.data?.pagination?.total || 0,
      page: apolloResponse.data?.pagination?.page || 1
    });
  } catch (error) {
    console.error('Apollo API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Request timeout' });
    }

    if (!error.response) {
      return res.status(502).json({ error: 'Network error' });
    }

    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Apollo proxy server running on port ${PORT}`);
  console.log(`CORS enabled for origin: http://localhost:5174`);
});
