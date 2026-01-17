import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { getDefaultStorage, STORAGE_KEYS } from '../../../shared/lib/storage';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const storage = getDefaultStorage();

  const handleStart = async () => {
    try {
      // Сохраняем флаг, что Welcome страница была показана
      await storage.setItem(STORAGE_KEYS.WELCOME_SHOWN, 'true');
      navigate('/home');
    } catch (error) {
      console.error('Failed to save welcome flag:', error);
      // Все равно переходим на Home
      navigate('/home');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Добро пожаловать!</h1>
      <p style={{ marginBottom: '30px', fontSize: '16px', maxWidth: '500px' }}>
        Добро пожаловать в Task Manager. Здесь вы можете управлять своими задачами и повышать продуктивность.
      </p>
      <Button type="primary" size="large" onClick={handleStart}>
        Начать
      </Button>
    </div>
  );
};
