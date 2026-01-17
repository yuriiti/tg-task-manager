import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/task.api';
import { CreateTaskDto, UpdateTaskDto } from '@task-manager/types';

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskDto) => taskApi.createTask(data),
    onSuccess: (task, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (variables.workspaceId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', 'workspace', variables.workspaceId] });
      }
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
      taskApi.updateTask(id, data),
    onSuccess: (task, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
      // Invalidate workspace tasks if task has workspaceId
      if (task && typeof task === 'object' && 'workspaceId' in task && task.workspaceId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', 'workspace', task.workspaceId] });
      }
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      // Invalidate all workspace tasks queries
      queryClient.invalidateQueries({ queryKey: ['tasks', 'workspace'] });
    },
  });
};
