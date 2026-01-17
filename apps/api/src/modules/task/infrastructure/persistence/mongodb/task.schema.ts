import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TaskStatus, TaskPriority } from '@task-manager/types';

export type TaskDocument = Task &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, type: String, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ required: true, enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop()
  dueDate?: Date;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Workspace' })
  workspaceId?: MongooseSchema.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// Indexes
TaskSchema.index({ userId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ createdAt: 1 });
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ tags: 1 });
