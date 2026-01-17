import { Task } from '@task-manager/types';

export class TaskResponseDto implements Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: Task['status'];
  priority: Task['priority'];
  dueDate?: Date | string;
  tags?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
