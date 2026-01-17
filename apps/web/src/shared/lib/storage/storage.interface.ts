/**
 * Интерфейс для работы с хранилищем
 */
export interface IStorage {
  /**
   * Сохранить значение по ключу
   */
  setItem(key: string, value: string): Promise<void> | void;

  /**
   * Получить значение по ключу
   */
  getItem(key: string): Promise<string | null> | string | null;

  /**
   * Удалить значение по ключу
   */
  removeItem(key: string): Promise<void> | void;

  /**
   * Получить все ключи
   */
  getKeys(): Promise<string[]> | string[];

  /**
   * Очистить все данные
   */
  clear(): Promise<void> | void;
}
