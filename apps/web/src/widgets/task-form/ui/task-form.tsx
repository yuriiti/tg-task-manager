import React from 'react';
import { Form, Input, Button, Select, DatePicker, message, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { useCreateTaskMutation } from '../../../entities/task';
import { TaskStatus, TaskPriority, CreateTaskDto } from '@task-manager/types';

const { TextArea } = Input;
const { Option } = Select;

interface TaskFormProps {
  workspaceId?: string;
  onSuccess?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ workspaceId, onSuccess }) => {
  const [form] = Form.useForm();
  const createTaskMutation = useCreateTaskMutation();

  const handleSubmit = async (values: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Dayjs;
    tags?: string[];
  }) => {
    try {
      const taskData: CreateTaskDto = {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
        tags: values.tags,
        workspaceId: workspaceId,
      };

      await createTaskMutation.mutateAsync(taskData);
      message.success('Task created successfully');
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error('Failed to create task');
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please enter task title' }]}
      >
        <Input placeholder="Enter task title" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea rows={3} placeholder="Enter task description" />
      </Form.Item>

      <Space style={{ width: '100%' }} size="middle">
        <Form.Item name="status" label="Status" style={{ flex: 1 }}>
          <Select placeholder="Select status">
            <Option value={TaskStatus.TODO}>To Do</Option>
            <Option value={TaskStatus.IN_PROGRESS}>In Progress</Option>
            <Option value={TaskStatus.DONE}>Done</Option>
            <Option value={TaskStatus.CANCELLED}>Cancelled</Option>
          </Select>
        </Form.Item>

        <Form.Item name="priority" label="Priority" style={{ flex: 1 }}>
          <Select placeholder="Select priority">
            <Option value={TaskPriority.LOW}>Low</Option>
            <Option value={TaskPriority.MEDIUM}>Medium</Option>
            <Option value={TaskPriority.HIGH}>High</Option>
            <Option value={TaskPriority.URGENT}>Urgent</Option>
          </Select>
        </Form.Item>
      </Space>

      <Form.Item name="dueDate" label="Due Date">
        <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>

      <Form.Item name="tags" label="Tags">
        <Select mode="tags" placeholder="Add tags" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={createTaskMutation.isPending} block>
          Create Task
        </Button>
      </Form.Item>
    </Form>
  );
};
