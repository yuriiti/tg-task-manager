import { apiClient } from '../../../shared/api/client';
import { User, AuthResult } from '@task-manager/types';
import { endpoints } from '../../../shared/api/endpoints';

export const userApi = {
  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  login: async (initData: string, isMock: boolean = false): Promise<AuthResult> => {
    const response = await apiClient.post(
      endpoints.auth.login,
      null,
      {
        headers: {
          Authorization: isMock ? `mock-tma ${initData}` : `TMA ${initData}`,
        },
      }
    );
    return response.data;
  },
};
