import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';

export interface CreateUserData {
  id: string; // telegramId
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
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    const existingUser = await this.userRepository.findById(data.id);
    if (existingUser) {
      throw new ConflictException('User with this ID already exists');
    }

    const user = new UserEntity(
      data.id, // telegramId используется как id
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
