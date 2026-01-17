import React, { useState } from 'react';
import { Typography, Space, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { SwipeableTaskCard } from '../../../entities/task';
import { SwipeAction } from '../../../shared/ui/swipeable-actions';
import { useWorkspaceTasks } from '../../../entities/task/model/use-workspace-tasks';
import { Task } from '@task-manager/types';

const { Title } = Typography;

interface WorkspaceTasksSectionProps {
  workspaceId: string;
}

export const WorkspaceTasksSection: React.FC<WorkspaceTasksSectionProps> = ({
  workspaceId,
}) => {
  const { tasks, isLoading } = useWorkspaceTasks(workspaceId);
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const handleDelete = (taskId: string) => {
    console.log('Delete task:', taskId);
  };

  const getActions = (task: Task): SwipeAction[] => [
    {
      label: 'Delete',
      icon: <DeleteOutlined />,
      onClick: () => handleDelete(task.id),
      color: 'danger',
    },
  ];

  const handleSwipeStart = (taskId: string) => {
    if (openCardId && openCardId !== taskId) {
      setOpenCardId(null);
    }
  };

  if (isLoading) {
    return null;
  }

  if (tasks.length === 0) {
    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={4}>Tasks</Title>
        <Empty description="No tasks in this workspace" />
      </Space>
    );
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Title level={4}>Tasks</Title>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {tasks.map((task) => (
          <SwipeableTaskCard
            key={task.id}
            task={task}
            actions={getActions(task)}
            isOpen={openCardId === task.id}
            onOpenChange={(isOpen) => setOpenCardId(isOpen ? task.id : null)}
            onSwipeStart={() => handleSwipeStart(task.id)}
            onCardClick={() => {
              console.log('Card clicked:', task.id);
            }}
          />
        ))}
      </Space>
    </Space>
  );
};
