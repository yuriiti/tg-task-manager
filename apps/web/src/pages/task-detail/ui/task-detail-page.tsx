import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../../widgets/header';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Header />
      <div>Task Detail: {id}</div>
    </div>
  );
};
