import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSSEClient, closeSSEClient } from '../../../shared/lib/sse/sse-client';
import { TaskEvent, TaskEventType, Task } from '@task-manager/types';

export function useTaskSSE() {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = createSSEClient('/tasks/sse', {
      onMessage: (event: MessageEvent) => {
        try {
          const taskEvent: TaskEvent = JSON.parse(event.data);
          handleTaskEvent(taskEvent);
        } catch (error) {
          console.error('Failed to parse task event:', error);
        }
      },
      onError: (error) => {
        console.error('SSE connection error:', error);
      },
      onOpen: () => {
        console.log('SSE connection opened for tasks');
      },
    });

    eventSourceRef.current = eventSource;

    return () => {
      closeSSEClient(eventSourceRef.current);
      eventSourceRef.current = null;
    };
  }, []);

  const handleTaskEvent = (event: TaskEvent) => {
    const { type, payload } = event;
    const { task, workspaceId } = payload;

    switch (type) {
      case TaskEventType.CREATED:
        handleTaskCreated(task, workspaceId);
        break;

      case TaskEventType.UPDATED:
        handleTaskUpdated(task, workspaceId);
        break;

      case TaskEventType.DELETED:
        handleTaskDeleted(task, workspaceId);
        break;

      case TaskEventType.STATUS_CHANGED:
        handleTaskStatusChanged(task, workspaceId);
        break;

      default:
        console.warn('Unknown task event type:', type);
    }
  };

  const handleTaskCreated = (task: Task, workspaceId?: string) => {
    // Обновляем список всех задач
    queryClient.setQueryData<Task[]>(['tasks'], (old = []) => {
      if (old.some((t) => t.id === task.id)) {
        return old.map((t) => (t.id === task.id ? task : t));
      }
      return [...old, task];
    });

    // Обновляем список задач workspace, если указан workspaceId
    if (workspaceId) {
      queryClient.setQueryData<Task[]>(['tasks', 'workspace', workspaceId], (old = []) => {
        if (old.some((t) => t.id === task.id)) {
          return old.map((t) => (t.id === task.id ? task : t));
        }
        return [...old, task];
      });
    }

    // Создаем отдельный query для задачи
    queryClient.setQueryData<Task>(['tasks', task.id], task);
  };

  const handleTaskUpdated = (task: Task, workspaceId?: string) => {
    // Обновляем список всех задач
    queryClient.setQueryData<Task[]>(['tasks'], (old = []) => {
      return old.map((t) => (t.id === task.id ? task : t));
    });

    // Обновляем список задач workspace, если указан workspaceId
    if (workspaceId) {
      queryClient.setQueryData<Task[]>(['tasks', 'workspace', workspaceId], (old = []) => {
        return old.map((t) => (t.id === task.id ? task : t));
      });
    }

    // Обновляем отдельный query для задачи
    queryClient.setQueryData<Task>(['tasks', task.id], task);
  };

  const handleTaskDeleted = (task: Task, workspaceId?: string) => {
    // Удаляем из списка всех задач
    queryClient.setQueryData<Task[]>(['tasks'], (old = []) => {
      return old.filter((t) => t.id !== task.id);
    });

    // Удаляем из списка задач workspace, если указан workspaceId
    if (workspaceId) {
      queryClient.setQueryData<Task[]>(['tasks', 'workspace', workspaceId], (old = []) => {
        return old.filter((t) => t.id !== task.id);
      });
    }

    // Удаляем отдельный query
    queryClient.removeQueries({ queryKey: ['tasks', task.id] });
  };

  const handleTaskStatusChanged = (task: Task, workspaceId?: string) => {
    // Аналогично обновлению, но можно добавить дополнительную логику
    handleTaskUpdated(task, workspaceId);
  };
}
