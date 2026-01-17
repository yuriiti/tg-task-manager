import { TaskStatus } from '@task-manager/types';

export class TaskStatusVO {
  constructor(private readonly value: TaskStatus) {
    if (!Object.values(TaskStatus).includes(value)) {
      throw new Error(`Invalid task status: ${value}`);
    }
  }

  getValue(): TaskStatus {
    return this.value;
  }

  canTransitionTo(newStatus: TaskStatus): boolean {
    // Define valid status transitions
    const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
      [TaskStatus.IN_PROGRESS]: [TaskStatus.DONE, TaskStatus.TODO, TaskStatus.CANCELLED],
      [TaskStatus.DONE]: [],
      [TaskStatus.CANCELLED]: [],
    };

    return validTransitions[this.value].includes(newStatus);
  }
}
