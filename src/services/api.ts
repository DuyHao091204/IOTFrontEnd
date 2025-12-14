import axios from "axios";

export const api = axios.create({
  baseURL: "${API_URL}", //  backend URL của bạn
});

import type { InternalAxiosRequestConfig } from "axios";

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
