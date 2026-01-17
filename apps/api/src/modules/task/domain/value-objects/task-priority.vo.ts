import { TaskPriority } from '@task-manager/types';

export class TaskPriorityVO {
  constructor(private readonly value: TaskPriority) {
    if (!Object.values(TaskPriority).includes(value)) {
      throw new Error(`Invalid task priority: ${value}`);
    }
  }

  getValue(): TaskPriority {
    return this.value;
  }
}
