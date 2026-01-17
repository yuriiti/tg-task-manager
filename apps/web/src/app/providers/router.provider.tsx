import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TasksPage } from '../../pages/tasks';
import { TaskDetailPage } from '../../pages/task-detail';
import { LoginPage } from '../../pages/login';
import { WelcomePage } from '../../pages/welcome';
import { HomePage } from '../../pages/home';
import { ProtectedRoute, WelcomeGuard } from './protected-route';

export const RouterProvider: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route
          path="/"
          element={
            <WelcomeGuard>
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            </WelcomeGuard>
          }
        />
        <Route
          path="/home"
          element={
            <WelcomeGuard>
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            </WelcomeGuard>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
