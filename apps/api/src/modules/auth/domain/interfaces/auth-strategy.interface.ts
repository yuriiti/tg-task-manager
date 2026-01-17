import { ExecutionContext } from '@nestjs/common';

/**
 * Result of authentication process
 */
export interface AuthResult {
  user: {
    id: string;
    userId: string;
    telegramId?: string;
    email?: string;
    username: string;
    [key: string]: any;
  };
  metadata?: Record<string, any>;
}

/**
 * Authentication request data extracted from HTTP request
 */
export interface AuthRequest {
  authorization?: string;
  body?: any;
  headers?: Record<string, string>;
  [key: string]: any;
}

/**
 * Interface for authentication strategies
 * Each strategy implements a specific authentication method (TMA, OAuth, API Key, etc.)
 */
export interface IAuthStrategy {
  /**
   * Name of the authentication strategy
   */
  readonly name: string;

  /**
   * Extracts authentication data from the request
   * @param request - HTTP request context
   * @returns Extracted authentication data or null if not applicable
   */
  extractAuthData(request: AuthRequest): string | null;

  /**
   * Validates authentication data and returns user information
   * @param authData - Authentication data extracted from request
   * @returns Authentication result with user information
   * @throws UnauthorizedException if validation fails
   */
  validate(authData: string): Promise<AuthResult>;

  /**
   * Checks if this strategy can handle the given request
   * @param request - HTTP request context
   * @returns true if this strategy can handle the request
   */
  canHandle(request: AuthRequest): boolean;
}
