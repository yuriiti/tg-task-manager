import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { TmaValidationService } from './infrastructure/services/tma-validation.service';
import { TmaAuthStrategy } from './infrastructure/strategies/tma-auth.strategy';
import { MockTmaAuthStrategy } from './infrastructure/strategies/mock-tma-auth.strategy';
import { TmaAuthGuard } from './presentation/guards/tma-auth.guard';
import { AuthGuard } from './presentation/guards/auth.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TmaValidationService,
    TmaAuthStrategy,
    MockTmaAuthStrategy,
    TmaAuthGuard,
    AuthGuard,
  ],
  exports: [AuthService, TmaAuthGuard, AuthGuard],
})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    private readonly tmaAuthStrategy: TmaAuthStrategy,
    private readonly mockTmaAuthStrategy: MockTmaAuthStrategy,
  ) {}

  onModuleInit() {
    // Register authentication strategies
    // To add a new strategy:
    // 1. Create a new class implementing IAuthStrategy
    // 2. Add it to providers array
    // 3. Register it here: this.authService.registerStrategy(newStrategy)
    this.authService.registerStrategy(this.tmaAuthStrategy);
    this.authService.registerStrategy(this.mockTmaAuthStrategy);
  }
}
