import React from 'react';
import { WorkspaceForm } from '../../../widgets/workspace-form';
import { Card } from 'antd';
import { Header } from '../../../widgets/header';
import { AppLayout } from '../../../shared/ui/app-layout';

export const HomePage: React.FC = () => {
  return (
    <AppLayout>
      <Header />
      <div style={{ padding: '16px' }}>
        <Card title="Create Workspace">
          <WorkspaceForm />
        </Card>
      </div>
    </AppLayout>
  );
};
