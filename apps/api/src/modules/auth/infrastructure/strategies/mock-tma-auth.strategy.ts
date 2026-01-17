import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import {
  IAuthStrategy,
  AuthResult,
  AuthRequest,
} from '../../domain/interfaces/auth-strategy.interface';
import { UserService } from '../../../user/application/services/user.service';

/**
 * Mock TMA authentication strategy for development/testing
 * Uses prefix "mock-tma" instead of "TMA"
 */
@Injectable()
export class MockTmaAuthStrategy implements IAuthStrategy {
  readonly name = 'MOCK_TMA';

  constructor(private readonly userService: UserService) {}

  canHandle(request: AuthRequest): boolean {
    const authHeader = request.authorization || request.headers?.['authorization'];

    // For mock strategy, always return true to allow usage even without header
    // This enables testing/development scenarios
    if (!authHeader) {
      return false;
    }

    return authHeader.startsWith('mock-tma ');
  }

  extractAuthData(request: AuthRequest): string | null {
    const authHeader = request.authorization || request.headers?.['authorization'];

    if (!authHeader) {
      // Try to get from body as fallback
      if (request.body?.initData) {
        return request.body.initData;
      }
      // For mock strategy, return a non-empty string to pass validation
      // Empty string will be handled in validate() with default values
      return 'mock';
    }

    if (!authHeader.startsWith('mock-tma ')) {
      // For mock strategy, return a non-empty string to pass validation
      // Empty string will be handled in validate() with default values
      return 'mock';
    }

    // Extract the data after "mock-tma " prefix
    return authHeader.substring('mock-tma '.length).trim();
  }

  async validate(authData: string): Promise<AuthResult> {
    // Mock user data - можно парсить из authData или использовать дефолтные значения
    const mockTelegramId = this.extractMockTelegramId(authData) || '123456789';
    const mockUsername = this.extractMockUsername(authData) || `mock_user_${mockTelegramId}`;
    const mockFirstName = this.extractMockFirstName(authData) || 'Mock';
    const mockLastName = this.extractMockLastName(authData) || 'User';

    // Find or create user by Telegram ID (userId = telegramId)
    let user = await this.userService.findByUserId(mockTelegramId).catch(() => null);

    if (!user) {
      // Create new user from mock data
      // Handle ConflictException in case user was created between findByUserId and create
      try {
        user = await this.userService.create({
          userId: mockTelegramId,
          username: mockUsername,
          firstName: mockFirstName,
          lastName: mockLastName,
          languageCode: 'en',
          isPremium: false,
        });
      } catch (error) {
        if (error instanceof ConflictException) {
          // User was created between findByUserId and create, fetch it again
          user = await this.userService.findByUserId(mockTelegramId).catch(() => null);
          if (!user) {
            throw new UnauthorizedException('Failed to create or find user');
          }
        } else {
          throw error;
        }
      }
    }

    if (user) {
      // Update user data if needed
      const updateData: any = {};
      if (mockFirstName && user.firstName !== mockFirstName) {
        updateData.firstName = mockFirstName;
      }
      if (mockLastName && user.lastName !== mockLastName) {
        updateData.lastName = mockLastName;
      }
      if (mockUsername && user.username !== mockUsername) {
        updateData.username = mockUsername;
      }

      if (Object.keys(updateData).length > 0) {
        user = await this.userService.update(user.id, updateData);
      }
    }

    if (!user) {
      throw new UnauthorizedException('Failed to authenticate: user not found or created');
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
        telegramUser: {
          id: parseInt(mockTelegramId),
          first_name: mockFirstName,
          last_name: mockLastName,
          username: mockUsername,
          is_premium: false,
        },
        authDate: Math.floor(Date.now() / 1000),
        isMock: true,
      },
    };
  }

  /**
   * Extracts mock Telegram ID from auth data
   * Format: "telegramId=123456789" or just "123456789"
   */
  private extractMockTelegramId(authData: string): string | null {
    const telegramIdMatch = authData.match(/telegramId=(\d+)/) || authData.match(/^(\d+)$/);
    return telegramIdMatch ? telegramIdMatch[1] : null;
  }

  /**
   * Extracts mock username from auth data
   * Format: "username=mockuser" or from query string
   */
  private extractMockUsername(authData: string): string | null {
    const usernameMatch = authData.match(/username=([^&]+)/);
    return usernameMatch ? decodeURIComponent(usernameMatch[1]) : null;
  }

  /**
   * Extracts mock first name from auth data
   * Format: "firstName=John" or from query string
   */
  private extractMockFirstName(authData: string): string | null {
    const firstNameMatch = authData.match(/firstName=([^&]+)/);
    return firstNameMatch ? decodeURIComponent(firstNameMatch[1]) : null;
  }

  /**
   * Extracts mock last name from auth data
   * Format: "lastName=Doe" or from query string
   */
  private extractMockLastName(authData: string): string | null {
    const lastNameMatch = authData.match(/lastName=([^&]+)/);
    return lastNameMatch ? decodeURIComponent(lastNameMatch[1]) : null;
  }
}
