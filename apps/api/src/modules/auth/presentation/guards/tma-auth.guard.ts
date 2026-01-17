import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthRequest } from '../../domain/interfaces/auth-strategy.interface';

/**
 * TMA-specific authentication guard
 * Uses TMA strategy for authentication
 */
@Injectable()
export class TmaAuthGuard implements CanActivate {
  private readonly logger = new Logger(TmaAuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const authRequest: AuthRequest = {
      authorization: request.headers['authorization'],
      body: request.body,
      headers: request.headers,
      ...request,
    };

    try {
      // Use TMA strategy specifically
      // const authResult = await this.authService.authenticateWithStrategy('TMA', authRequest);
      const authResult = await this.authService.authenticateWithStrategy('MOCK_TMA', authRequest); // TODO: remove this

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
