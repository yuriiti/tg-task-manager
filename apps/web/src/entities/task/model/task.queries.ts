import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../api/task.api';

export const useTasksQuery = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskApi.getTasks(),
  });
};

export const useWorkspaceTasksQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ['tasks', 'workspace', workspaceId],
    queryFn: () => taskApi.getTasks(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useTaskQuery = (id: string) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskApi.getTask(id),
    enabled: !!id,
  });
};
