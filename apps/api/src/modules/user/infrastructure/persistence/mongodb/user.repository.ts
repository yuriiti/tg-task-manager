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
    // id is telegramId, used as _id in MongoDB
    const user = await this.userModel.findById(id).exec();
    return user ? this.toDomain(user) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user ? this.toDomain(user) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = new this.userModel({
      _id: user.id, // telegramId используется как _id
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
      .findByIdAndUpdate(id, { ...user, updatedAt: new Date() }, { new: true })
      .exec();

    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  private toDomain(user: UserDocument): UserEntity {
    return new UserEntity(
      user._id.toString(), // _id = telegramId
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
