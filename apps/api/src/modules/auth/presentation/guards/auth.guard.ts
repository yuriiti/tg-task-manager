import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthRequest } from '../../domain/interfaces/auth-strategy.interface';

/**
 * Abstract authentication guard that uses AuthService with strategies
 */
@Injectable()
export class AuthGuard implements CanActivate {
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
      const authResult = await this.authService.authenticate(authRequest);

      // Attach user to request
      request.user = authResult.user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
