import React from 'react';
import { useWorkspaceSSE } from '../../entities/workspace/model/use-workspace-sse';

export const WorkspaceSSEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useWorkspaceSSE();

  return <>{children}</>;
};
