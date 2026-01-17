import React, { useState } from 'react';
import { Typography, Space, Empty, Collapse, Spin, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { SwipeableTaskCard, useDeleteTaskMutation } from '../../../entities/task';
import { SwipeAction } from '../../../shared/ui/swipeable-actions';
import { useWorkspaceTasks } from '../../../entities/task/model/use-workspace-tasks';
import { Task } from '@task-manager/types';
import { TaskForm } from '../../task-form';

const { Title } = Typography;
const { Panel } = Collapse;

interface WorkspaceTasksSectionProps {
  workspaceId: string;
}

export const WorkspaceTasksSection: React.FC<WorkspaceTasksSectionProps> = ({
  workspaceId,
}) => {
  const { tasks, isLoading } = useWorkspaceTasks(workspaceId);
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const deleteTaskMutation = useDeleteTaskMutation();

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      message.success('Task deleted successfully');
    } catch (error) {
      message.error('Failed to delete task');
    }
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

  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };

  if (isLoading) {
    return (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Title level={4}>Tasks</Title>
        <Spin />
      </Space>
    );
  }

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      <Title level={4}>Tasks</Title>

      <Collapse
        activeKey={isFormOpen ? ['create'] : []}
        onChange={(keys) => setIsFormOpen(keys.includes('create'))}
      >
        <Panel
          key="create"
          header={
            <Space>
              <PlusOutlined />
              <span>Create New Task</span>
            </Space>
          }
        >
          <TaskForm workspaceId={workspaceId} onSuccess={handleFormSuccess} />
        </Panel>
      </Collapse>

      {tasks.length === 0 ? (
        <Empty description="No tasks in this workspace" />
      ) : (
        <Space orientation="vertical" size="small" style={{ width: '100%' }}>
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
      )}
    </Space>
  );
};
