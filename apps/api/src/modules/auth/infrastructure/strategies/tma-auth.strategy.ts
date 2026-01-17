import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAuthStrategy,
  AuthResult,
  AuthRequest,
} from '../../domain/interfaces/auth-strategy.interface';
import { TmaValidationService } from '../services/tma-validation.service';
import { UserService } from '../../../user/application/services/user.service';

@Injectable()
export class TmaAuthStrategy implements IAuthStrategy {
  readonly name = 'TMA';

  constructor(
    private readonly tmaValidationService: TmaValidationService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  canHandle(request: AuthRequest): boolean {
    const authHeader = request.authorization || request.headers?.['authorization'];
    return !!authHeader && authHeader.startsWith('TMA ');
  }

  extractAuthData(request: AuthRequest): string | null {
    const authHeader = request.authorization || request.headers?.['authorization'];

    if (!authHeader) {
      // Try to get from body as fallback
      if (request.body?.initData) {
        return request.body.initData;
      }
      return null;
    }

    if (!authHeader.startsWith('TMA ')) {
      return null;
    }

    return this.tmaValidationService.extractInitDataFromHeader(authHeader);
  }

  async validate(authData: string): Promise<AuthResult> {
    const botToken = this.configService.get<string>('BOT_TOKEN');

    if (!botToken) {
      throw new UnauthorizedException('Bot token is not configured');
    }

    // Validate TMA token
    const validatedData = this.tmaValidationService.validateInitData(authData, botToken);
    const telegramUser = validatedData.user;
    const telegramId = telegramUser.id.toString();

    // Find or create user by Telegram ID (userId = telegramId)
    let user = await this.userService.findByUserId(telegramId).catch(() => null);

    if (!user) {
      // Create new user from Telegram data
      user = await this.userService.create({
        userId: telegramId,
        username: telegramUser.username || `user_${telegramUser.id}`,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        languageCode: telegramUser.language_code,
        isPremium: telegramUser.is_premium || false,
        photoUrl: telegramUser.photo_url,
      });
    } else {
      // Update user data if needed
      const updateData: any = {};
      if (telegramUser.first_name && user.firstName !== telegramUser.first_name) {
        updateData.firstName = telegramUser.first_name;
      }
      if (telegramUser.last_name && user.lastName !== telegramUser.last_name) {
        updateData.lastName = telegramUser.last_name;
      }
      if (telegramUser.username && user.username !== telegramUser.username) {
        updateData.username = telegramUser.username;
      }
      if (telegramUser.photo_url && user.photoUrl !== telegramUser.photo_url) {
        updateData.photoUrl = telegramUser.photo_url;
      }

      if (Object.keys(updateData).length > 0) {
        user = await this.userService.update(user.id, updateData);
      }
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
      },
      metadata: {
        telegramUser: validatedData.user,
        authDate: validatedData.auth_date,
      },
    };
  }
}
