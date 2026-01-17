import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TasksPage } from '../../pages/tasks';
import { TaskDetailPage } from '../../pages/task-detail';
import { LoginPage } from '../../pages/login';

export const RouterProvider: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};
