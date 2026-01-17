import { useMutation } from '@tanstack/react-query';
import { AuthResult } from '@task-manager/types';
import { userApi } from '../api/user.api';
import { getInitData, isTelegramSDKAvailable } from '../../../shared/lib/telegram/telegram-sdk';
import { getMockInitData } from '../../../shared/lib/telegram/mock-init-data';
import { env } from '../../../shared/config/env';

/**
 * Получить initData для авторизации (реальный или mock)
 */
function getAuthInitData(): { initData: string; isMock: boolean } {
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

/**
 * Hook для авторизации через /auth/login
 */
export function useLoginMutation() {
  return useMutation<AuthResult, Error, void>({
    mutationFn: async () => {
      const { initData, isMock } = getAuthInitData();
      return userApi.login(initData, isMock);
    },
  });
}
