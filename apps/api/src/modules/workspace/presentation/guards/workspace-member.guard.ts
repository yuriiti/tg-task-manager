import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { IWorkspaceRepository } from '../../domain/interfaces/workspace.repository.interface';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(
    @Inject('IWorkspaceRepository') private readonly workspaceRepository: IWorkspaceRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const workspaceId = request.params.id;
    const userId = request.user?.id || request.user?.userId;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!workspaceId) {
      throw new ForbiddenException('Workspace ID is required');
    }

    const isParticipant = await this.workspaceRepository.isUserParticipant(workspaceId, userId);

    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant of this workspace');
    }

    return true;
  }
}
