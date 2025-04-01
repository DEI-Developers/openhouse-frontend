import {empty} from '@utils/helpers';
import axios from 'axios';

// @ts-ignore
const BASE_URL = import.meta.env.VITE_API_URL;

const apiInstance = axios.create({
  baseURL: BASE_URL,
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
