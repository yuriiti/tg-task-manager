import { User } from '@task-manager/types';

export class UserResponseDto implements User {
  id: string;
  username: string;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}
