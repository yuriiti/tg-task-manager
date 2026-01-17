import { env } from '../../config/env';
import { getAuthInitData } from '../telegram/telegram-sdk';

export interface SSEClientOptions {
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Создает SSE соединение с авторизацией
 * EventSource не поддерживает кастомные headers, поэтому передаем Authorization через query параметр
 */
export function createSSEClient(endpoint: string, options: SSEClientOptions = {}): EventSource {
  const { onMessage, onError, onOpen, onClose } = options;

  try {
    const { initData, isMock } = getAuthInitData();
    const authPrefix = isMock ? 'mock-tma' : 'TMA';
    const authHeader = `${authPrefix} ${initData}`;

    // Кодируем Authorization header для передачи через URL
    const encodedAuth = encodeURIComponent(authHeader);
    const baseUrl = env.API_URL || 'http://localhost:3000/api';
    const url = `${baseUrl}${endpoint}?authorization=${encodedAuth}`;

    const eventSource = new EventSource(url);

    if (onMessage) {
      eventSource.onmessage = onMessage;
    }

    if (onError) {
      eventSource.onerror = onError;
    }

    if (onOpen) {
      eventSource.onopen = onOpen;
    }

    if (onClose) {
      eventSource.addEventListener('close', onClose);
    }

    return eventSource;
  } catch (error) {
    console.error('Failed to create SSE client:', error);
    throw new Error('Failed to create SSE client: No auth data available');
  }
}

/**
 * Закрывает SSE соединение
 */
export function closeSSEClient(eventSource: EventSource | null): void {
  if (eventSource) {
    eventSource.close();
  }
}
