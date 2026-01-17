import React from 'react';
import { Layout } from 'antd';
import { BottomNavbar } from '../../../widgets/bottom-navbar';

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, showNavbar = true }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ paddingBottom: showNavbar ? '48px' : 0 }}>{children}</Content>
      {showNavbar && <BottomNavbar />}
    </Layout>
  );
};
