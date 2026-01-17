import { useWorkspaceTasksQuery } from './task.queries';

export const useWorkspaceTasks = (workspaceId: string | undefined) => {
  const { data: tasks = [], isLoading, error } = useWorkspaceTasksQuery(workspaceId || '');

  return {
    tasks,
    isLoading,
    error,
  };
};
