import {empty} from '@utils/helpers';
import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'https://squid-app-ebe2n.ondigitalocean.app/api/v2',
  params: {},
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const requestInterceptor = (config) => {
  const token = localStorage.getItem('appToken');

  if (!empty(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

apiInstance.interceptors.request.use(requestInterceptor);

export default apiInstance;
