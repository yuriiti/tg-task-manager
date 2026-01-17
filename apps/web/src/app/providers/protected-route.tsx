import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../shared/lib/hooks/use-auth';
import { getDefaultStorage, STORAGE_KEYS } from '../../shared/lib/storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Компонент для защиты роутов, требующих авторизации
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Компонент для проверки Welcome страницы
 */
export const WelcomeGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shouldShowWelcome, setShouldShowWelcome] = useState<boolean | null>(null);
  const storage = getDefaultStorage();

  useEffect(() => {
    const checkWelcome = async () => {
      try {
        const welcomeShown = await storage.getItem(STORAGE_KEYS.WELCOME_SHOWN);
        setShouldShowWelcome(welcomeShown !== 'true');
      } catch (error) {
        console.error('Failed to check welcome status:', error);
        setShouldShowWelcome(false);
      }
    };

    checkWelcome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (shouldShowWelcome === null) {
    return <div>Loading...</div>;
  }

  if (shouldShowWelcome) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};
