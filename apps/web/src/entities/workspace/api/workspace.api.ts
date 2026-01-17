import { apiClient } from '../../../shared/api/client';
import { Workspace, CreateWorkspaceDto, UpdateWorkspaceDto, InviteParticipantDto } from '@task-manager/types';

export const workspaceApi = {
  getWorkspaces: async (): Promise<Workspace[]> => {
    const response = await apiClient.get('/workspaces');
    return response.data;
  },

  getWorkspace: async (id: string): Promise<Workspace> => {
    const response = await apiClient.get(`/workspaces/${id}`);
    return response.data;
  },

  createWorkspace: async (data: CreateWorkspaceDto): Promise<Workspace> => {
    const response = await apiClient.post('/workspaces', data);
    return response.data;
  },

  updateWorkspace: async (id: string, data: UpdateWorkspaceDto): Promise<Workspace> => {
    const response = await apiClient.patch(`/workspaces/${id}`, data);
    return response.data;
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${id}`);
  },

  inviteParticipant: async (id: string, data: InviteParticipantDto): Promise<Workspace> => {
    const response = await apiClient.post(`/workspaces/${id}/invite`, data);
    return response.data;
  },
};
