import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { WorkspaceService } from '../../application/services/workspace.service';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  InviteParticipantDto,
  WorkspaceResponseDto,
} from '../../application/dto';
import { WorkspaceEntity } from '../../domain/entities/workspace.entity';
import { WorkspaceMemberGuard } from '../guards/workspace-member.guard';
import { WorkspaceEventService } from '../../infrastructure/events/workspace-event.service';

@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly workspaceEventService: WorkspaceEventService,
  ) {}

  @Post()
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Request() req: any,
  ): Promise<WorkspaceResponseDto> {
    const userId = req.user?.id || req.user?.userId;
    const workspace = await this.workspaceService.create(userId, createWorkspaceDto);
    return this.toResponseDto(workspace);
  }

  @Get(':id')
  @UseGuards(WorkspaceMemberGuard)
  async findOne(@Param('id') id: string, @Request() req: any): Promise<WorkspaceResponseDto> {
    const userId = req.user?.id || req.user?.userId;
    const workspace = await this.workspaceService.findOne(id, userId);
    return this.toResponseDto(workspace);
  }

  @Patch(':id')
  @UseGuards(WorkspaceMemberGuard)
  async update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @Request() req: any,
  ): Promise<WorkspaceResponseDto> {
    const userId = req.user?.id || req.user?.userId;
    const workspace = await this.workspaceService.update(id, userId, updateWorkspaceDto);
    return this.toResponseDto(workspace);
  }

  @Delete(':id')
  @UseGuards(WorkspaceMemberGuard)
  async remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    const userId = req.user?.id || req.user?.userId;
    await this.workspaceService.delete(id, userId);
  }

  @Post(':id/invite')
  @UseGuards(WorkspaceMemberGuard)
  async inviteParticipant(
    @Param('id') id: string,
    @Body() inviteParticipantDto: InviteParticipantDto,
    @Request() req: any,
  ): Promise<WorkspaceResponseDto> {
    const userId = req.user?.id || req.user?.userId;
    const workspace = await this.workspaceService.inviteParticipant(
      id,
      userId,
      inviteParticipantDto,
    );
    return this.toResponseDto(workspace);
  }

  @Get(':id/sse')
  @UseGuards(WorkspaceMemberGuard)
  @Sse()
  workspaceSse(@Param('id') id: string): Observable<MessageEvent> {
    return this.workspaceEventService.getEventStream(id);
  }

  private toResponseDto(workspace: WorkspaceEntity): WorkspaceResponseDto {
    return {
      id: workspace.id,
      name: workspace.name,
      participantIds: workspace.participantIds,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }
}
