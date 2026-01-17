import { apiClient } from '../../../shared/api/client';
import { User } from '@task-manager/types';

export const userApi = {
  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
};
