export class UserEntity {
  constructor(
    public readonly id: string, // telegramId используется как id
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
