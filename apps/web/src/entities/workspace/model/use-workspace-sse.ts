import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSSEClient, closeSSEClient } from '../../../shared/lib/sse/sse-client';
import { WorkspaceEvent, WorkspaceEventType, Workspace } from '@task-manager/types';

export function useWorkspaceSSE() {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = createSSEClient('/workspaces/sse', {
      onMessage: (event: MessageEvent) => {
        try {
          const workspaceEvent: WorkspaceEvent = JSON.parse(event.data);
          handleWorkspaceEvent(workspaceEvent);
        } catch (error) {
          console.error('Failed to parse workspace event:', error);
        }
      },
      onError: (error) => {
        console.error('SSE connection error:', error);
      },
      onOpen: () => {
        console.log('SSE connection opened for workspaces');
      },
    });

    eventSourceRef.current = eventSource;

    return () => {
      closeSSEClient(eventSourceRef.current);
      eventSourceRef.current = null;
    };
  }, []);

  const handleWorkspaceEvent = (event: WorkspaceEvent) => {
    const { type, workspaceId, payload } = event;

    switch (type) {
      case WorkspaceEventType.WORKSPACE_CREATED:
        handleWorkspaceCreated(payload.workspace!);
        break;

      case WorkspaceEventType.WORKSPACE_DELETED:
        handleWorkspaceDeleted(workspaceId);
        break;

      case WorkspaceEventType.NAME_UPDATED:
        handleNameUpdated(workspaceId, payload.name!);
        break;

      case WorkspaceEventType.PARTICIPANT_ADDED:
        handleParticipantAdded(workspaceId, payload.participantIds!);
        break;

      case WorkspaceEventType.PARTICIPANT_REMOVED:
        handleParticipantRemoved(workspaceId, payload.participantIds!);
        break;

      default:
        console.warn('Unknown workspace event type:', type);
    }
  };

  const handleWorkspaceCreated = (workspace: Workspace) => {
    // Обновляем список всех workspace
    queryClient.setQueryData<Workspace[]>(['workspaces'], (old = []) => {
      // Проверяем, нет ли уже такого workspace
      if (old.some((w) => w.id === workspace.id)) {
        return old.map((w) => (w.id === workspace.id ? workspace : w));
      }
      return [...old, workspace];
    });

    // Создаем отдельный query для workspace
    queryClient.setQueryData<Workspace>(['workspaces', workspace.id], workspace);
  };

  const handleWorkspaceDeleted = (workspaceId: string) => {
    // Удаляем из списка всех workspace
    queryClient.setQueryData<Workspace[]>(['workspaces'], (old = []) => {
      return old.filter((w) => w.id !== workspaceId);
    });

    // Удаляем отдельный query
    queryClient.removeQueries({ queryKey: ['workspaces', workspaceId] });
  };

  const handleNameUpdated = (workspaceId: string, name: string) => {
    // Обновляем в списке всех workspace
    queryClient.setQueryData<Workspace[]>(['workspaces'], (old = []) => {
      return old.map((w) => (w.id === workspaceId ? { ...w, name } : w));
    });

    // Обновляем отдельный query
    queryClient.setQueryData<Workspace>(['workspaces', workspaceId], (old) => {
      if (!old) return old;
      return { ...old, name };
    });
  };

  const handleParticipantAdded = (workspaceId: string, participantIds: string[]) => {
    // Обновляем в списке всех workspace
    queryClient.setQueryData<Workspace[]>(['workspaces'], (old = []) => {
      return old.map((w) => (w.id === workspaceId ? { ...w, participantIds } : w));
    });

    // Обновляем отдельный query
    queryClient.setQueryData<Workspace>(['workspaces', workspaceId], (old) => {
      if (!old) return old;
      return { ...old, participantIds };
    });
  };

  const handleParticipantRemoved = (workspaceId: string, participantIds: string[]) => {
    // Обновляем в списке всех workspace
    queryClient.setQueryData<Workspace[]>(['workspaces'], (old = []) => {
      return old.map((w) => (w.id === workspaceId ? { ...w, participantIds } : w));
    });

    // Обновляем отдельный query
    queryClient.setQueryData<Workspace>(['workspaces', workspaceId], (old) => {
      if (!old) return old;
      return { ...old, participantIds };
    });
  };
}
