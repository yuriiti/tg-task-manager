import { Request as ExpressRequest } from 'express';
import { AuthResult } from '@task-manager/types';

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends ExpressRequest {
  user: AuthResult['user'];
}
