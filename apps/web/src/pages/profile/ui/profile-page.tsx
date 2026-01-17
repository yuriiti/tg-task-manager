import React from 'react';
import { Avatar, Typography, Flex, Space } from 'antd';
import { AppLayout } from '../../../shared/ui/app-layout';
import { Header } from '../../../widgets/header';
import { useAuth } from '../../../shared/lib/hooks/use-auth';

const { Title, Text } = Typography;

const APP_NAME = '@task-manager/web';
const APP_VERSION = '1.0.0';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.username || 'User';
  };

  return (
    <AppLayout>
      <Header />
      <Flex
        vertical
        style={{
          height: 'calc(100vh - 100px)',
          padding: '40px 20px',
        }}
      >
        <Flex vertical align="center" justify="center" flex={1} gap={24}>
          <Avatar
            size={120}
            src={user?.photoUrl}
            style={{
              backgroundColor: '#1890ff',
              fontSize: '48px',
              border: '4px solid #f0f0f0',
            }}
          >
            {!user?.photoUrl && getInitials()}
          </Avatar>

          <Space orientation="vertical" align="center" size={4}>
            <Title level={2} style={{ margin: 0 }}>
              {getDisplayName()}
            </Title>
            {user?.lastName && (
              <Text type="secondary" style={{ fontSize: '16px' }}>
                {user.lastName}
              </Text>
            )}
          </Space>
        </Flex>

        <Flex justify="center" style={{ paddingTop: '40px' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {APP_NAME} v{APP_VERSION}
          </Text>
        </Flex>
      </Flex>
    </AppLayout>
  );
};
