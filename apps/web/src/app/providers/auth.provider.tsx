import React, { useEffect, useState, useCallback, ReactNode } from 'react';
import { useLoginMutation } from '../../entities/user/model/user.mutations';
import { getDefaultStorage, STORAGE_KEYS } from '../../shared/lib/storage';
import { AuthContext, AuthContextType } from '../../shared/lib/context/auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const storage = getDefaultStorage();

  const loginMutation = useLoginMutation();

  const performLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await loginMutation.mutateAsync();
      setUser(result.user);

      // Сохраняем информацию о пользователе в хранилище
      try {
        await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.user));
      } catch (storageError) {
        console.warn('Failed to save user data to storage:', storageError);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
      setUser(null);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loginMutation, storage]);

  const refetch = useCallback(() => {
    performLogin();
  }, [performLogin]);

  useEffect(() => {
    // Проверяем, есть ли сохраненные данные пользователя
    const loadUserFromStorage = async () => {
      try {
        const userDataStr = await storage.getItem(STORAGE_KEYS.USER_DATA);
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            setUser(userData);
            setIsLoading(false);
            // Все равно выполняем login для обновления данных
            performLogin();
            return;
          } catch (parseError) {
            console.warn('Failed to parse user data from storage:', parseError);
          }
        }
      } catch (storageError) {
        console.warn('Failed to load user data from storage:', storageError);
      }

      // Если данных нет, выполняем login
      performLogin();
    };

    loadUserFromStorage();
  }, [performLogin, storage]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
