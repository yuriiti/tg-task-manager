import { useMemo } from 'react';
import { Task, TaskStatus, TaskPriority } from '@task-manager/types';

export const useWorkspaceTasks = (workspaceId: string | undefined) => {
  const tasks = useMemo<Task[]>(() => {
    if (!workspaceId) return [];

    return [
      {
        id: '1',
        userId: 'user1',
        title: 'Design new feature',
        description: 'Create mockups for the new task management feature',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        tags: ['design', 'ui'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: 'user1',
        title: 'Implement API endpoints',
        description: 'Create REST API endpoints for task management',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tags: ['backend', 'api'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        userId: 'user1',
        title: 'Write unit tests',
        description: 'Add unit tests for task service',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        tags: ['testing'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        userId: 'user1',
        title: 'Review pull requests',
        description: 'Review and merge pending pull requests',
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }, [workspaceId]);

  return {
    tasks,
    isLoading: false,
    error: null,
  };
};
