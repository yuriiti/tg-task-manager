import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthStrategy, AuthResult, AuthRequest } from '../../domain/interfaces/auth-strategy.interface';

/**
 * Authentication service that delegates to registered authentication strategies
 */
@Injectable()
export class AuthService {
  private strategies: Map<string, IAuthStrategy> = new Map();

  /**
   * Registers an authentication strategy
   */
  registerStrategy(strategy: IAuthStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  /**
   * Authenticates a request using the appropriate strategy
   * @param request - HTTP request context
   * @returns Authentication result
   * @throws UnauthorizedException if no strategy can handle the request or validation fails
   */
  async authenticate(request: AuthRequest): Promise<AuthResult> {
    // Find a strategy that can handle this request
    const strategy = this.findStrategy(request);

    if (!strategy) {
      throw new UnauthorizedException('No authentication strategy found for this request');
    }

    // Extract authentication data
    const authData = strategy.extractAuthData(request);

    if (!authData) {
      throw new UnauthorizedException('Failed to extract authentication data');
    }

    // Validate and authenticate
    return strategy.validate(authData);
  }

  /**
   * Authenticates using a specific strategy by name
   * @param strategyName - Name of the strategy to use
   * @param request - HTTP request context
   * @returns Authentication result
   */
  async authenticateWithStrategy(strategyName: string, request: AuthRequest): Promise<AuthResult> {
    const strategy = this.strategies.get(strategyName);

    if (!strategy) {
      throw new UnauthorizedException(`Authentication strategy '${strategyName}' not found`);
    }

    const authData = strategy.extractAuthData(request);

    if (!authData) {
      throw new UnauthorizedException('Failed to extract authentication data');
    }

    return strategy.validate(authData);
  }

  /**
   * Finds an appropriate strategy for the given request
   */
  private findStrategy(request: AuthRequest): IAuthStrategy | null {
    for (const strategy of this.strategies.values()) {
      if (strategy.canHandle(request)) {
        return strategy;
      }
    }
    return null;
  }

  /**
   * Gets all registered strategies
   */
  getStrategies(): IAuthStrategy[] {
    return Array.from(this.strategies.values());
  }

  /**
   * Gets a strategy by name
   */
  getStrategy(name: string): IAuthStrategy | undefined {
    return this.strategies.get(name);
  }
}
