import React from 'react';
import { TaskList } from '../../../widgets/task-list';
import { TaskFilters } from '../../../widgets/task-filters';
import { Header } from '../../../widgets/header';

export const TasksPage: React.FC = () => {
  return (
    <div>
      <Header />
      <TaskFilters />
      <TaskList />
    </div>
  );
};
