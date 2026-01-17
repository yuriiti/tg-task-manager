import { useQuery } from '@tanstack/react-query';
import { AuthResult } from '@task-manager/types';
import { userApi } from '../api/user.api';
import { getAuthInitData } from '../../../shared/lib/telegram/telegram-sdk';

export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getUser(id),
  });
};

/**
 * Query для получения профиля пользователя через /auth/login
 */
export function useProfileQuery() {
  const { initData } = getAuthInitData();

  return useQuery<AuthResult, Error>({
    queryKey: ['auth', 'profile'],
    queryFn: () => userApi.profile(),
    enabled: !!initData,
  });
}
