import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    // id is telegramId, search by id field
    const user = await this.userModel.findOne({ id }).exec();
    return user ? this.toDomain(user) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user ? this.toDomain(user) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = new this.userModel({
      id: user.id, // telegramId используется как id
      username: user.username,
      isActive: user.isActive,
      firstName: user.firstName,
      lastName: user.lastName,
      languageCode: user.languageCode,
      isPremium: user.isPremium,
      photoUrl: user.photoUrl,
      lastLoginAt: user.lastLoginAt,
    });

    const saved = await createdUser.save();
    return this.toDomain(saved);
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null> {
    const updated = await this.userModel
      .findOneAndUpdate({ id }, { ...user, updatedAt: new Date() }, { new: true })
      .exec();

    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findOneAndDelete({ id }).exec();
    return !!result;
  }

  private toDomain(user: UserDocument): UserEntity {
    return new UserEntity(
      user.id, // id = telegramId
      user.username,
      user.isActive,
      user.firstName,
      user.lastName,
      user.languageCode,
      user.isPremium,
      user.photoUrl,
      user.lastLoginAt,
      user.createdAt,
      user.updatedAt,
    );
  }
}
