import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', //  backend URL của bạn
});

import type { InternalAxiosRequestConfig } from 'axios';

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
