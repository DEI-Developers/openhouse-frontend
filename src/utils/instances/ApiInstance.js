import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'https://openhouse-xvol.onrender.com/api/v2',
  params: {},
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default apiInstance;
