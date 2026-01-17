import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/user.api';

export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getUser(id),
  });
};
