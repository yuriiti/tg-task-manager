import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from '../../domain/interfaces/user.repository.token';
import { UserEntity } from '../../domain/entities/user.entity';

export interface CreateUserData {
  userId: string; // telegramId
  username: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
}

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository,
  ) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByUserId(data.userId);
    if (existingUser) {
      throw new ConflictException('User with this userId already exists');
    }

    // При создании id будет пустой, MongoDB создаст _id автоматически
    const user = new UserEntity(
      '', // id будет установлен MongoDB при сохранении
      data.userId, // telegramId
      data.username,
      true,
      data.firstName,
      data.lastName,
      data.languageCode,
      data.isPremium,
      data.photoUrl,
    );

    return this.userRepository.create(user);
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUserId(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException(`User with userId ${userId} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findByUsername(username);
  }

  async update(id: string, updateData: Partial<UserEntity>): Promise<UserEntity> {
    const updated = await this.userRepository.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updated;
  }
}
