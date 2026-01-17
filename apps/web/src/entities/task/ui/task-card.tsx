import React from 'react';
import { Card, Typography, Space } from 'antd';
import { Task } from '@task-manager/types';
import { TaskStatusBadge } from './task-status-badge';

const { Text, Title } = Typography;

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Title level={5} style={{ margin: 0, flex: 1 }}>
            {task.title}
          </Title>
          <TaskStatusBadge status={task.status} />
        </div>

        {task.description && (
          <Text type="secondary" ellipsis style={{ display: 'block' }}>
            {task.description}
          </Text>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {task.dueDate && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Due: {formatDate(task.dueDate)}
            </Text>
          )}
          {task.priority && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Priority: {task.priority}
            </Text>
          )}
        </div>
      </Space>
    </Card>
  );
};
