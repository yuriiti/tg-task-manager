import { User } from '@task-manager/types';

export class UserEntity implements Omit<User, 'lastLoginAt' | 'createdAt' | 'updatedAt'> {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly isActive: boolean = true,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly languageCode?: string,
    public readonly isPremium?: boolean,
    public readonly photoUrl?: string,
    public readonly lastLoginAt?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
