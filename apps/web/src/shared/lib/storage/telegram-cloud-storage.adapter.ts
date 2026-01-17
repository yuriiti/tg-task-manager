import { IStorage } from './storage.interface';
import { getCloudStorage, isCloudStorageAvailable } from '../telegram/telegram-sdk';

/**
 * Адаптер для Telegram CloudStorage
 */
export class TelegramCloudStorageAdapter implements IStorage {
  async setItem(key: string, value: string): Promise<void> {
    if (!isCloudStorageAvailable()) {
      throw new Error('Telegram CloudStorage is not available');
    }

    const cloudStorage = getCloudStorage();
    if (!cloudStorage) {
      throw new Error('CloudStorage instance is not available');
    }

    try {
      await cloudStorage.set(key, value);
    } catch (error) {
      console.error('Telegram CloudStorage setItem error:', error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!isCloudStorageAvailable()) {
      return null;
    }

    const cloudStorage = getCloudStorage();
    if (!cloudStorage) {
      return null;
    }

    try {
      const result = await cloudStorage.get(key);
      return result || null;
    } catch (error) {
      console.error('Telegram CloudStorage getItem error:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!isCloudStorageAvailable()) {
      return;
    }

    const cloudStorage = getCloudStorage();
    if (!cloudStorage) {
      return;
    }

    try {
      await cloudStorage.delete(key);
    } catch (error) {
      console.error('Telegram CloudStorage removeItem error:', error);
    }
  }

  async getKeys(): Promise<string[]> {
    if (!isCloudStorageAvailable()) {
      return [];
    }

    const cloudStorage = getCloudStorage();
    if (!cloudStorage) {
      return [];
    }

    try {
      return await cloudStorage.getKeys();
    } catch (error) {
      console.error('Telegram CloudStorage getKeys error:', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    if (!isCloudStorageAvailable()) {
      return;
    }

    const cloudStorage = getCloudStorage();
    if (!cloudStorage) {
      return;
    }

    try {
      const keys = await this.getKeys();
      await Promise.all(keys.map((key) => this.removeItem(key)));
    } catch (error) {
      console.error('Telegram CloudStorage clear error:', error);
    }
  }
}
