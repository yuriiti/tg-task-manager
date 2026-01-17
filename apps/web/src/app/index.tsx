import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from './providers/router.provider';
import { QueryProvider } from './providers/query.provider';
import { AntdProvider } from './providers/antd.provider';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <AntdProvider>
        <RouterProvider />
      </AntdProvider>
    </QueryProvider>
  </React.StrictMode>,
);
