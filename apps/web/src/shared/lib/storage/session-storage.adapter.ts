import { IStorage } from './storage.interface';

/**
 * Адаптер для SessionStorage
 */
export class SessionStorageAdapter implements IStorage {
  setItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('SessionStorage setItem error:', error);
      throw error;
    }
  }

  getItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error('SessionStorage getItem error:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('SessionStorage removeItem error:', error);
    }
  }

  getKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('SessionStorage getKeys error:', error);
      return [];
    }
  }

  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('SessionStorage clear error:', error);
    }
  }
}
