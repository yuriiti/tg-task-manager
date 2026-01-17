import { createContext } from 'react';
import { AuthResult } from '@task-manager/types';

export interface AuthContextType {
  user: AuthResult['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  refetch: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
