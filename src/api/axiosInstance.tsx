// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://minehair401.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem('accessToken');

      if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
  },
    
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("unauthorized"));
    }
    return Promise.reject(error);
  }
);



export default axiosInstance;
