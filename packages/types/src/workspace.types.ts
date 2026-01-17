export interface Workspace {
  id: string;
  name: string;
  participantIds: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateWorkspaceDto {
  name: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
}

export interface InviteParticipantDto {
  userId: string;
}

export enum WorkspaceEventType {
  WORKSPACE_CREATED = 'workspace_created',
  WORKSPACE_DELETED = 'workspace_deleted',
  NAME_UPDATED = 'name_updated',
  PARTICIPANT_ADDED = 'participant_added',
  PARTICIPANT_REMOVED = 'participant_removed',
}

export interface WorkspaceEvent {
  type: WorkspaceEventType;
  workspaceId: string;
  payload: {
    workspace?: Workspace;
    workspaceId?: string;
    name?: string;
    participantId?: string;
    participantIds?: string[];
  };
}
