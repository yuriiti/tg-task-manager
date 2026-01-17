import { useQuery } from '@tanstack/react-query';
import { workspaceApi } from '../api/workspace.api';

export const useWorkspacesQuery = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceApi.getWorkspaces(),
  });
};

export const useWorkspaceQuery = (id: string) => {
  return useQuery({
    queryKey: ['workspaces', id],
    queryFn: () => workspaceApi.getWorkspace(id),
    enabled: !!id,
  });
};
