import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from './providers/router.provider';
import { QueryProvider } from './providers/query.provider';
import { AntdProvider } from './providers/antd.provider';
import { AuthProvider } from './providers/auth.provider';
import { WorkspaceSSEProvider } from './providers/workspace-sse.provider';
import { TaskSSEProvider } from './providers/task-sse.provider';
import { initializeTelegramSDK } from '../shared/lib/telegram/telegram-sdk';
import './styles/index.css';

// Инициализация Telegram SDK при старте приложения
if (typeof window !== 'undefined') {
  initializeTelegramSDK();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <AntdProvider>
        <AuthProvider>
          <WorkspaceSSEProvider>
            <TaskSSEProvider>
              <RouterProvider />
            </TaskSSEProvider>
          </WorkspaceSSEProvider>
        </AuthProvider>
      </AntdProvider>
    </QueryProvider>
  </React.StrictMode>,
);
