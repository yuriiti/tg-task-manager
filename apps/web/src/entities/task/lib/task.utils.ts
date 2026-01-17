import { TaskStatus } from '@task-manager/types';

export const getTaskStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'default',
    [TaskStatus.IN_PROGRESS]: 'processing',
    [TaskStatus.DONE]: 'success',
    [TaskStatus.CANCELLED]: 'error',
  };
  return colors[status] || 'default';
};
