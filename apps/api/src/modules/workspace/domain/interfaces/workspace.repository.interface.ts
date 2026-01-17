import { WorkspaceEntity } from '../entities/workspace.entity';

export interface IWorkspaceRepository {
  findById(id: string): Promise<WorkspaceEntity | null>;
  findByUserId(userId: string): Promise<WorkspaceEntity[]>;
  create(workspace: WorkspaceEntity): Promise<WorkspaceEntity>;
  update(id: string, workspace: Partial<WorkspaceEntity>): Promise<WorkspaceEntity | null>;
  delete(id: string): Promise<boolean>;
  isUserParticipant(workspaceId: string, userId: string): Promise<boolean>;
}
