import { env } from '../../config/env';

/**
 * Генерация mock initData для dev режима
 * Формат: query string или просто telegramId
 */
export function generateMockInitData(options?: {
  telegramId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}): string {
  const telegramId = options?.telegramId || '123456789';
  const username = options?.username || `mock_user_${telegramId}`;
  const firstName = options?.firstName || 'Mock';
  const lastName = options?.lastName || 'User';

  // Формат query string для совместимости с бэкендом
  const params = new URLSearchParams({
    telegramId,
    username,
    firstName,
    lastName,
  });

  return params.toString();
}

/**
 * Получить mock initData (используется в dev режиме)
 */
export function getMockInitData(): string {
  if (env.NODE_ENV !== 'development') {
    throw new Error('Mock initData should only be used in development mode');
  }

  return generateMockInitData();
}
