import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

import outputs from '../../amplify_outputs.json';

const apiClient = axios.create({
  baseURL: outputs.data.url,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.warn('Auth session not available for request', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - potential session expiry');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
