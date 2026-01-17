import { Workspace } from '@task-manager/types';

export class WorkspaceResponseDto implements Workspace {
  id: string;
  name: string;
  participantIds: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
