import { init, cloudStorage, retrieveLaunchParams } from '@tma.js/sdk-react';
import { getMockInitData } from './mock-init-data';
import { env } from '../../config/env';

let sdkInitialized = false;
let initDataRaw: string | null = null;

/**
 * Инициализация Telegram SDK
 */
export function initializeTelegramSDK(): boolean {
  if (sdkInitialized) {
    return true;
  }

  try {
    // Инициализация пакета @tma.js/sdk-react
    init();

    const launchParams = retrieveLaunchParams();

    if (launchParams.initDataRaw) {
      initDataRaw =
        typeof launchParams.initDataRaw === 'string'
          ? launchParams.initDataRaw
          : String(launchParams.initDataRaw);
      sdkInitialized = true;
      return true;
    }
  } catch (error) {
    // SDK недоступен (dev режим или не в Telegram)
    console.warn('Telegram SDK not available:', error);
  }

  return false;
}

/**
 * Получить initData из SDK
 */
export function getInitData(): string | null {
  if (!sdkInitialized) {
    initializeTelegramSDK();
  }

  return initDataRaw;
}

/**
 * Получить CloudStorage из SDK
 */
export function getCloudStorage(): typeof cloudStorage | null {
  if (!sdkInitialized) {
    initializeTelegramSDK();
  }

  return cloudStorage.isSupported() ? cloudStorage : null;
}

/**
 * Проверить, доступен ли Telegram SDK
 */
export function isTelegramSDKAvailable(): boolean {
  if (!sdkInitialized) {
    return initializeTelegramSDK();
  }
  return sdkInitialized;
}

/**
 * Проверить, доступен ли CloudStorage
 */
export function isCloudStorageAvailable(): boolean {
  return isTelegramSDKAvailable() && cloudStorage.isSupported();
}

/**
 * Получить initData для авторизации (реальный или mock)
 */
export function getAuthInitData(): { initData: string; isMock: boolean } {
  if (isTelegramSDKAvailable()) {
    const initData = getInitData();
    if (initData) {
      return { initData, isMock: false };
    }
  }

  // В dev режиме используем mock
  if (env.NODE_ENV === 'development') {
    return { initData: getMockInitData(), isMock: true };
  }

  throw new Error('No initData available and not in development mode');
}

// Инициализация при импорте модуля
if (typeof window !== 'undefined') {
  initializeTelegramSDK();
}
