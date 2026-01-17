import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useCreateWorkspaceMutation } from '../../../entities/workspace';

export const WorkspaceForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const createWorkspaceMutation = useCreateWorkspaceMutation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { name: string }) => {
    setLoading(true);
    try {
      const workspace = await createWorkspaceMutation.mutateAsync({ name: values.name });
      message.success('Workspace created successfully');
      form.resetFields();
      navigate(`/workspaces/${workspace.id}`);
    } catch (error) {
      message.error('Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="name"
        label="Workspace Name"
        rules={[{ required: true, message: 'Please enter workspace name' }]}
      >
        <Input placeholder="Enter workspace name" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Create Workspace
        </Button>
      </Form.Item>
    </Form>
  );
};
