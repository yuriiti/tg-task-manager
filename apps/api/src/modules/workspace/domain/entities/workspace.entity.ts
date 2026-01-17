export class WorkspaceEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly participantIds: string[],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  hasParticipant(userId: string): boolean {
    return this.participantIds.includes(userId);
  }

  canBeDeletedBy(userId: string): boolean {
    return this.hasParticipant(userId);
  }
}
