import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';

const { Footer } = Layout;

export const BottomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    if (path === '/workspaces') {
      return location.pathname.startsWith('/workspaces');
    }
    return location.pathname === path;
  };

  return (
    <Footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 0',
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        zIndex: 1000,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Button
        type={isActive('/home') ? 'primary' : 'text'}
        icon={<HomeOutlined />}
        onClick={() => navigate('/home')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 'auto',
          padding: '8px 24px',
        }}
      >
        Home
      </Button>
      <Button
        type={isActive('/workspaces') ? 'primary' : 'text'}
        icon={<TeamOutlined />}
        onClick={() => navigate('/workspaces')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 'auto',
          padding: '8px 24px',
        }}
      >
        Workspaces
      </Button>
      <Button
        type={isActive('/profile') ? 'primary' : 'text'}
        icon={<UserOutlined />}
        onClick={() => navigate('/profile')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 'auto',
          padding: '8px 24px',
        }}
      >
        Profile
      </Button>
    </Footer>
  );
};
