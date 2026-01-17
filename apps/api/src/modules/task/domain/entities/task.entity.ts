import { TaskStatus, TaskPriority } from '@task-manager/types';

export class TaskEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly description?: string,
    public readonly status: TaskStatus = TaskStatus.TODO,
    public readonly priority: TaskPriority = TaskPriority.MEDIUM,
    public readonly dueDate?: Date,
    public readonly tags: string[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  isOverdue(): boolean {
    if (!this.dueDate) return false;
    return this.dueDate < new Date() && this.status !== TaskStatus.DONE;
  }

  canChangeStatus(newStatus: TaskStatus): boolean {
    // Basic validation - can be extended with more complex rules
    return Object.values(TaskStatus).includes(newStatus);
  }
}
