import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Button,
  Space,
  Descriptions,
  Spin,
  message,
  Popconfirm,
  Input,
  Form,
} from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Header } from '../../../widgets/header';
import { AppLayout } from '../../../shared/ui/app-layout';
import {
  useWorkspaceQuery,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from '../../../entities/workspace';

const { Title } = Typography;

export const WorkspaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const { data: workspace, isLoading } = useWorkspaceQuery(id || '');
  const updateWorkspaceMutation = useUpdateWorkspaceMutation();
  const deleteWorkspaceMutation = useDeleteWorkspaceMutation();

  const handleUpdate = async (values: { name: string }) => {
    if (!id) return;

    try {
      await updateWorkspaceMutation.mutateAsync({ id, data: { name: values.name } });
      message.success('Workspace updated successfully');
      setIsEditing(false);
    } catch (error) {
      message.error('Failed to update workspace');
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteWorkspaceMutation.mutateAsync(id);
      message.success('Workspace deleted successfully');
      navigate('/workspaces');
    } catch (error) {
      message.error('Failed to delete workspace');
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Header />
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (!workspace) {
    return (
      <AppLayout>
        <Header />
        <div style={{ padding: '16px' }}>
          <Title level={3}>Workspace not found</Title>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header />
      <div style={{ padding: '16px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/workspaces')}>
              Back
            </Button>
            {!isEditing && (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsEditing(true);
                    form.setFieldsValue({ name: workspace.name });
                  }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this workspace?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />} loading={deleteWorkspaceMutation.isPending}>
                    Delete
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>

          <Card>
            {isEditing ? (
              <Form form={form} onFinish={handleUpdate} layout="vertical">
                <Form.Item
                  name="name"
                  label="Workspace Name"
                  rules={[{ required: true, message: 'Please enter workspace name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={updateWorkspaceMutation.isPending}>
                      Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              <Descriptions title="Workspace Details" bordered>
                <Descriptions.Item label="Name" span={3}>
                  <Title level={4} style={{ margin: 0 }}>
                    {workspace.name}
                  </Title>
                </Descriptions.Item>
                <Descriptions.Item label="Icon" span={3}>
                  <TeamOutlined style={{ fontSize: '24px' }} />
                </Descriptions.Item>
                <Descriptions.Item label="Participants" span={3}>
                  {workspace.participantIds.length}
                </Descriptions.Item>
                <Descriptions.Item label="Created At" span={3}>
                  {new Date(workspace.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At" span={3}>
                  {new Date(workspace.updatedAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        </Space>
      </div>
    </AppLayout>
  );
};
