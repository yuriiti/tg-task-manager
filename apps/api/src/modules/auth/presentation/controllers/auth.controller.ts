import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthRequest } from '../../domain/interfaces/auth-strategy.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Generic login endpoint that uses the appropriate strategy
   */
  @Post('login')
  async login(@Request() req: any) {
    const authRequest: AuthRequest = {
      authorization: req.headers['authorization'],
      body: req.body,
      headers: req.headers,
      ...req,
    };

    return this.authService.authenticate(authRequest);
  }

}
