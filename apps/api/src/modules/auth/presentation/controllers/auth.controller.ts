import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthRequest, AuthResult } from '../../domain/interfaces/auth-strategy.interface';
import { AuthenticatedRequest } from '../../../../common/types/request.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Generic login endpoint that uses the appropriate strategy
   */
  @Post('login')
  async login(@Request() req: AuthenticatedRequest): Promise<AuthResult> {
    const authRequest: AuthRequest = {
      authorization: req.headers['authorization'],
      ...req,
    };

    return this.authService.authenticate(authRequest);
  }
}
