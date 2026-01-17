import React, { ReactNode } from 'react';
import { useProfileQuery } from '../../entities/user/model/user.queries';
import { AuthContext, AuthContextType } from '../../shared/lib/context/auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data, isLoading, error, refetch } = useProfileQuery();
  const user = data?.user || null;

  const value: AuthContextType = {
    user,
    isLoading: isLoading,
    isAuthenticated: !!user,
    error,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
