import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface ValidatedInitData {
  user: TelegramUser;
  auth_date: number;
  query_id?: string;
  receiver?: TelegramUser;
  chat?: any;
  chat_type?: string;
  chat_instance?: string;
  start_param?: string;
}

@Injectable()
export class TmaValidationService {
  private readonly WEBAPP_SECRET_KEY_CONST = 'WebAppData';
  private readonly INIT_DATA_MAX_AGE = 5 * 60; // 5 minutes

  /**
   * Validates Telegram Mini App initData according to Telegram documentation
   * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
   */
  validateInitData(initDataStr: string, botToken: string): ValidatedInitData {
    if (!initDataStr || !botToken) {
      throw new UnauthorizedException('initData and botToken are required');
    }

    // Parse query string
    const params = this.parseQueryString(initDataStr);

    const { hash, auth_date } = params;
    if (!hash || !auth_date) {
      throw new UnauthorizedException('Missing hash or auth_date in initData');
    }

    // Validate auth_date (should not be too old)
    const authDateNum = parseInt(auth_date, 10);
    if (Number.isNaN(authDateNum)) {
      throw new UnauthorizedException('Invalid auth_date format');
    }

    const now = Math.floor(Date.now() / 1000);
    if (now - authDateNum > this.INIT_DATA_MAX_AGE) {
      throw new UnauthorizedException('initData expired');
    }

    // Remove hash from params for validation
    const paramsCopy = { ...params };
    delete paramsCopy.hash;

    // Sort keys alphabetically
    const sortedKeys = Object.keys(paramsCopy).sort();
    const dataCheckString = sortedKeys
      .map((key) => `${key}=${paramsCopy[key]}`)
      .join('\n');

    // Compute secret_key = HMAC_SHA256(bot_token, "WebAppData")
    const secretKey = crypto
      .createHmac('sha256', this.WEBAPP_SECRET_KEY_CONST)
      .update(botToken)
      .digest();

    // Compute expected hash
    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    const hashBuffer = Buffer.from(hash, 'hex');
    const expectedHashBuffer = Buffer.from(expectedHash, 'hex');

    if (hashBuffer.length !== expectedHashBuffer.length) {
      throw new UnauthorizedException('Invalid hash');
    }

    if (!crypto.timingSafeEqual(hashBuffer, expectedHashBuffer)) {
      throw new UnauthorizedException('Invalid hash signature');
    }

    // Parse user object
    if (!params.user) {
      throw new UnauthorizedException('Missing user in initData');
    }

    let user: TelegramUser;
    try {
      const decoded = decodeURIComponent(params.user);
      user = JSON.parse(decoded);
    } catch (e) {
      throw new UnauthorizedException('Invalid user data format');
    }

    const result: ValidatedInitData = {
      user,
      auth_date: authDateNum,
    };

    // Optional fields
    if (params.query_id) {
      result.query_id = params.query_id;
    }
    if (params.receiver) {
      try {
        result.receiver = JSON.parse(decodeURIComponent(params.receiver));
      } catch (e) {
        // Ignore if receiver is invalid
      }
    }
    if (params.chat) {
      try {
        result.chat = JSON.parse(decodeURIComponent(params.chat));
      } catch (e) {
        // Ignore if chat is invalid
      }
    }
    if (params.chat_type) {
      result.chat_type = params.chat_type;
    }
    if (params.chat_instance) {
      result.chat_instance = params.chat_instance;
    }
    if (params.start_param) {
      result.start_param = params.start_param;
    }

    return result;
  }

  /**
   * Extracts initData from Authorization header
   * Expected format: "TMA <initData>"
   */
  extractInitDataFromHeader(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    if (!authHeader.startsWith('TMA ')) {
      throw new UnauthorizedException('Invalid authorization header format. Expected: TMA <initData>');
    }

    return authHeader.slice(4).trim();
  }

  /**
   * Parses query string into object with URL decoding
   */
  private parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {};
    const pairs = queryString.split('&');

    for (const pair of pairs) {
      const [key, ...valueParts] = pair.split('=');
      if (key) {
        const value = valueParts.length > 0 ? valueParts.join('=') : '';
        try {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        } catch (e) {
          // If decoding fails, use original value
          params[key] = value;
        }
      }
    }

    return params;
  }
}
