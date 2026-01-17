import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  id: string; // telegramId

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  languageCode?: string;

  isPremium?: boolean;

  @IsString()
  photoUrl?: string;
}
