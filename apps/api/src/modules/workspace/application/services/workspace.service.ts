import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { IWorkspaceRepository } from '../../domain/interfaces/workspace.repository.interface';
import { WorkspaceEntity } from '../../domain/entities/workspace.entity';
import { CreateWorkspaceDto, UpdateWorkspaceDto, InviteParticipantDto } from '../dto';
import { WorkspaceEventService } from '../../infrastructure/events/workspace-event.service';
import { WorkspaceEventType } from '@task-manager/types';
import { TaskService } from '../../../task/application/services/task.service';

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject('IWorkspaceRepository') private readonly workspaceRepository: IWorkspaceRepository,
    private readonly workspaceEventService: WorkspaceEventService,
    private readonly taskService: TaskService,
  ) {}

  async create(userId: string, createWorkspaceDto: CreateWorkspaceDto): Promise<WorkspaceEntity> {
    const workspace = new WorkspaceEntity(
      '',
      createWorkspaceDto.name,
      [userId],
    );

    return this.workspaceRepository.create(workspace);
  }

  async findAll(userId: string): Promise<WorkspaceEntity[]> {
    return this.workspaceRepository.findByUserId(userId);
  }

  async findOne(id: string, userId: string): Promise<WorkspaceEntity> {
    const workspace = await this.workspaceRepository.findById(id);

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    if (!workspace.hasParticipant(userId)) {
      throw new ForbiddenException('You are not a participant of this workspace');
    }

    return workspace;
  }

  async update(
    id: string,
    userId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    await this.findOne(id, userId);

    const updatedWorkspace = await this.workspaceRepository.update(id, {
      name: updateWorkspaceDto.name,
      updatedAt: new Date(),
    });

    if (!updatedWorkspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    if (updateWorkspaceDto.name) {
      this.workspaceEventService.emitEvent(id, WorkspaceEventType.NAME_UPDATED, {
        name: updatedWorkspace.name,
      });
    }

    return updatedWorkspace;
  }

  async delete(id: string, userId: string): Promise<void> {
    const workspace = await this.findOne(id, userId);

    await this.taskService.deleteByWorkspaceId(id);
    await this.workspaceRepository.delete(id);
    this.workspaceEventService.removeStream(id);
  }

  async inviteParticipant(
    workspaceId: string,
    inviterId: string,
    inviteParticipantDto: InviteParticipantDto,
  ): Promise<WorkspaceEntity> {
    const workspace = await this.findOne(workspaceId, inviterId);

    if (workspace.hasParticipant(inviteParticipantDto.userId)) {
      throw new BadRequestException('User is already a participant of this workspace');
    }

    const updatedParticipantIds = [...workspace.participantIds, inviteParticipantDto.userId];
    const updatedWorkspace = await this.workspaceRepository.update(workspaceId, {
      participantIds: updatedParticipantIds,
      updatedAt: new Date(),
    });

    if (!updatedWorkspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    this.workspaceEventService.emitEvent(workspaceId, WorkspaceEventType.PARTICIPANT_ADDED, {
      participantId: inviteParticipantDto.userId,
      participantIds: updatedParticipantIds,
    });

    return updatedWorkspace;
  }

  async removeParticipant(
    workspaceId: string,
    removerId: string,
    userIdToRemove: string,
  ): Promise<WorkspaceEntity> {
    const workspace = await this.findOne(workspaceId, removerId);

    if (!workspace.hasParticipant(userIdToRemove)) {
      throw new BadRequestException('User is not a participant of this workspace');
    }

    const updatedParticipantIds = workspace.participantIds.filter(
      (id) => id !== userIdToRemove,
    );
    const updatedWorkspace = await this.workspaceRepository.update(workspaceId, {
      participantIds: updatedParticipantIds,
      updatedAt: new Date(),
    });

    if (!updatedWorkspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    this.workspaceEventService.emitEvent(workspaceId, WorkspaceEventType.PARTICIPANT_REMOVED, {
      participantId: userIdToRemove,
      participantIds: updatedParticipantIds,
    });

    return updatedWorkspace;
  }
}
