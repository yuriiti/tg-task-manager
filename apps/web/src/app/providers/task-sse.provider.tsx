import React from 'react';
import { useTaskSSE } from '../../entities/task/model/use-task-sse';

export const TaskSSEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useTaskSSE();

  return <>{children}</>;
};
