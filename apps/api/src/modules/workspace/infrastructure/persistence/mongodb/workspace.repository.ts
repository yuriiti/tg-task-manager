import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IWorkspaceRepository } from '../../../domain/interfaces/workspace.repository.interface';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';
import { Workspace, WorkspaceDocument } from './workspace.schema';

@Injectable()
export class WorkspaceRepository implements IWorkspaceRepository {
  constructor(
    @InjectModel(Workspace.name) private readonly workspaceModel: Model<WorkspaceDocument>,
  ) {}

  async findById(id: string): Promise<WorkspaceEntity | null> {
    const workspace = await this.workspaceModel.findById(id).exec();
    return workspace ? this.toDomain(workspace) : null;
  }

  async create(workspace: WorkspaceEntity): Promise<WorkspaceEntity> {
    const participantObjectIds = workspace.participantIds.map(
      (id) => new Types.ObjectId(id),
    );
    const createdWorkspace = new this.workspaceModel({
      name: workspace.name,
      participantIds: participantObjectIds,
    });

    const saved = await createdWorkspace.save();
    return this.toDomain(saved);
  }

  async update(id: string, workspace: Partial<WorkspaceEntity>): Promise<WorkspaceEntity | null> {
    const updateData: any = { ...workspace, updatedAt: new Date() };
    
    if (workspace.participantIds) {
      updateData.participantIds = workspace.participantIds.map(
        (id) => new Types.ObjectId(id),
      );
    }

    const updated = await this.workspaceModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.workspaceModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async isUserParticipant(workspaceId: string, userId: string): Promise<boolean> {
    const workspace = await this.workspaceModel.findById(workspaceId).exec();
    if (!workspace) {
      return false;
    }
    const userObjectId = new Types.ObjectId(userId);
    return workspace.participantIds.some(
      (id) => id.toString() === userObjectId.toString(),
    );
  }

  private toDomain(workspace: WorkspaceDocument): WorkspaceEntity {
    return new WorkspaceEntity(
      workspace._id.toString(),
      workspace.name,
      workspace.participantIds.map((id) => id.toString()),
      workspace.createdAt,
      workspace.updatedAt,
    );
  }
}
