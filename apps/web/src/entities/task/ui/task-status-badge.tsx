import React from 'react';
import { Tag } from 'antd';
import { TaskStatus } from '@task-manager/types';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const statusConfig: Record<TaskStatus, { color: string; label: string }> = {
  [TaskStatus.TODO]: { color: 'default', label: 'To Do' },
  [TaskStatus.IN_PROGRESS]: { color: 'processing', label: 'In Progress' },
  [TaskStatus.DONE]: { color: 'success', label: 'Done' },
  [TaskStatus.CANCELLED]: { color: 'error', label: 'Cancelled' },
};

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];

  return <Tag color={config.color}>{config.label}</Tag>;
};
