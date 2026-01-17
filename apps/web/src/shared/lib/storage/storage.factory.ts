import { IStorage } from './storage.interface';
import { StorageType } from './storage.types';
import { LocalStorageAdapter } from './local-storage.adapter';
import { SessionStorageAdapter } from './session-storage.adapter';
import { TelegramCloudStorageAdapter } from './telegram-cloud-storage.adapter';
import { isCloudStorageAvailable } from '../telegram/telegram-sdk';

/**
 * Фабрика для создания экземпляра хранилища
 */
export function createStorage(type?: StorageType): IStorage {
  // Если тип не указан, выбираем автоматически
  if (!type) {
    // Приоритет: Telegram CloudStorage > LocalStorage > SessionStorage
    if (isCloudStorageAvailable()) {
      return new TelegramCloudStorageAdapter();
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      return new LocalStorageAdapter();
    }

    return new SessionStorageAdapter();
  }

  // Создаем хранилище указанного типа
  switch (type) {
    case StorageType.TELEGRAM_CLOUD_STORAGE:
      if (!isCloudStorageAvailable()) {
        console.warn('Telegram CloudStorage is not available, falling back to LocalStorage');
        return new LocalStorageAdapter();
      }
      return new TelegramCloudStorageAdapter();

    case StorageType.LOCAL_STORAGE:
      return new LocalStorageAdapter();

    case StorageType.SESSION_STORAGE:
      return new SessionStorageAdapter();

    default:
      throw new Error(`Unknown storage type: ${type}`);
  }
}

/**
 * Получить дефолтное хранилище
 */
export function getDefaultStorage(): IStorage {
  return createStorage();
}
