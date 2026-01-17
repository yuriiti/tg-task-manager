export class UserResponseDto {
  id: string;
  username: string;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
  lastLoginAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
