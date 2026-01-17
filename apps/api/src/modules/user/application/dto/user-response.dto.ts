import { IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { User } from '@task-manager/types';

export class UserResponseDto implements User {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  languageCode?: string;

  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsDateString()
  lastLoginAt?: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}
