import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Typography, Empty, Spin } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { Header } from '../../../widgets/header';
import { AppLayout } from '../../../shared/ui/app-layout';
import { useWorkspacesQuery } from '../../../entities/workspace';

const { Title } = Typography;

export const WorkspacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: workspaces, isLoading } = useWorkspacesQuery();

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

  if (!workspaces || workspaces.length === 0) {
    return (
      <AppLayout>
        <Header />
        <div style={{ padding: '16px' }}>
          <Title level={3}>Workspaces</Title>
          <Empty description="No workspaces found" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header />
      <div style={{ padding: '16px' }}>
        <Title level={3}>Workspaces</Title>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={workspaces}
          renderItem={(workspace) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => navigate(`/workspaces/${workspace.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Meta
                  avatar={<TeamOutlined style={{ fontSize: '24px' }} />}
                  title={workspace.name}
                  description={`${workspace.participantIds.length} participant(s)`}
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </AppLayout>
  );
};
