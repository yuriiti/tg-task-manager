import { apiClient } from '../../../shared/api/client';
import { Task, CreateTaskDto, UpdateTaskDto } from '@task-manager/types';

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskDto): Promise<Task> => {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
