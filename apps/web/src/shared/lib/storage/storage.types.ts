/**
 * Типы хранилища
 */
export enum StorageType {
  LOCAL_STORAGE = 'localStorage',
  SESSION_STORAGE = 'sessionStorage',
  TELEGRAM_CLOUD_STORAGE = 'telegramCloudStorage',
}

/**
 * Ключи для хранения данных
 */
export const STORAGE_KEYS = {
  WELCOME_SHOWN: 'welcomeShown',
  USER_DATA: 'userData',
} as const;
