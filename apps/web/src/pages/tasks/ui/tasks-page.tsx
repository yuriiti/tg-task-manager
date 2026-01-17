import React from 'react';
import { AppLayout } from '../../../shared/ui/app-layout';
import { TaskList } from '../../../widgets/task-list';
import { TaskFilters } from '../../../widgets/task-filters';
import { Header } from '../../../widgets/header';

export const TasksPage: React.FC = () => {
  return (
    <AppLayout>
      <Header />
      <TaskFilters />
      <TaskList />
    </AppLayout>
  );
};
