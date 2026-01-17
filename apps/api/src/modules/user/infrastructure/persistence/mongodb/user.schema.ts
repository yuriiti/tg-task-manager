import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  userId: string; // telegramId

  @Prop({ required: true })
  username: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  languageCode?: string;

  @Prop()
  isPremium?: boolean;

  @Prop()
  photoUrl?: string;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ userId: 1 }, { unique: true });
UserSchema.index({ username: 1 });
UserSchema.index({ createdAt: 1 });
