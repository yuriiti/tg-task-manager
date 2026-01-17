import axios from 'axios';
import { env } from '../config/env';
import { getInitData, isTelegramSDKAvailable } from '../lib/telegram/telegram-sdk';
import { getMockInitData } from '../lib/telegram/mock-init-data';

export const apiClient = axios.create({
  baseURL: env.API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - добавляет initData в заголовок Authorization
apiClient.interceptors.request.use(
  (config) => {
    // Если заголовок Authorization уже установлен (например, для login), не перезаписываем
    if (config.headers.Authorization) {
      return config;
    }

    // Получаем initData
    let initData: string | null = null;
    let isMock = false;

    if (isTelegramSDKAvailable()) {
      initData = getInitData();
    }

    // Если SDK недоступен и мы в dev режиме, используем mock
    if (!initData && env.NODE_ENV === 'development') {
      try {
        initData = getMockInitData();
        isMock = true;
      } catch (error) {
        console.warn('Failed to get mock initData:', error);
      }
    }

    // Добавляем initData в заголовок
    if (initData) {
      config.headers.Authorization = isMock 
        ? `mock-tma ${initData}`
        : `TMA ${initData}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // При 401 ошибке редиректим на повторную авторизацию
      // В нашем случае это означает, что initData невалиден или истек
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
