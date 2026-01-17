import { initCloudStorage, retrieveLaunchParams } from '@tma.js/sdk';

let sdkInitialized = false;
let initDataRaw: string | null = null;
let cloudStorageInstance: ReturnType<typeof initCloudStorage> | null = null;

/**
 * Инициализация Telegram SDK
 */
export function initializeTelegramSDK(): boolean {
  if (sdkInitialized) {
    return true;
  }

  try {
    const launchParams = retrieveLaunchParams();

    if (launchParams.initDataRaw) {
      initDataRaw = launchParams.initDataRaw;
      cloudStorageInstance = initCloudStorage();
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
export function getCloudStorage(): ReturnType<typeof initCloudStorage> | null {
  if (!sdkInitialized) {
    initializeTelegramSDK();
  }

  return cloudStorageInstance;
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
  return isTelegramSDKAvailable() && cloudStorageInstance !== null;
}

// Инициализация при импорте модуля
if (typeof window !== 'undefined') {
  initializeTelegramSDK();
}
