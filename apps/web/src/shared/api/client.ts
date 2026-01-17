import axios from 'axios';
import { env } from '../config/env';
import { getAuthInitData } from '../lib/telegram/telegram-sdk';

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

    // Получаем initData для авторизации
    try {
      const { initData, isMock } = getAuthInitData();

      // Добавляем initData в заголовок
      if (initData) {
        config.headers.Authorization = isMock ? `mock-tma ${initData}` : `TMA ${initData}`;
      }
    } catch (error) {
      // Если initData недоступен, запрос уйдет без заголовка Authorization
      // Это нормально для некоторых публичных endpoints
      console.warn('Failed to get auth initData:', error);
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
