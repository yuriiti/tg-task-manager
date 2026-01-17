import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WorkspaceDocument = Workspace &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Workspace {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true, default: [] })
  participantIds: string[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);

// Indexes
WorkspaceSchema.index({ participantIds: 1 });
WorkspaceSchema.index({ createdAt: 1 });
