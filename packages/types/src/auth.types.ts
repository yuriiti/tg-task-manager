/**
 * Result of authentication process
 */
export interface AuthResult {
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    [key: string]: unknown;
  };
  metadata?: Record<string, unknown>;
}
