import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthRequest, AuthResult } from '../../domain/interfaces/auth-strategy.interface';
import { AuthenticatedRequest } from '../../../../common/types/request.types';

/**
 * TMA-specific authentication guard
 * Uses TMA strategy for authentication
 */
@Injectable()
export class TmaAuthGuard implements CanActivate {
  private readonly logger = new Logger(TmaAuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Для SSE endpoint authorization может быть в query параметрах
    let authorization = request.headers['authorization'] as string | undefined;
    if (!authorization && request.query?.authorization) {
      authorization = decodeURIComponent(request.query.authorization as string);
    }

    const authRequest: AuthRequest = {
      ...request,
      authorization,
      body: request.body,
      headers: request.headers as Record<string, string>,
    };

    try {
      // Use TMA strategy specifically
      let authResult: AuthResult;

      try {
        authResult = await this.authService.authenticateWithStrategy('TMA', authRequest);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          authResult = await this.authService.authenticateWithStrategy('MOCK_TMA', authRequest);
        } else {
          throw error;
        }
      }

      // Attach user to request
      request.user = authResult.user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Log the actual error for debugging
      this.logger.error('Authentication error:', error);
      throw new UnauthorizedException(`Invalid TMA token: ${error.message || 'Unknown error'}`);
    }
  }
}
