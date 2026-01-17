import { TaskEntity } from '../entities/task.entity';
import { TaskStatus, TaskPriority, TaskQueryParams } from '@task-manager/types';

export interface ITaskRepository {
  findById(id: string): Promise<TaskEntity | null>;
  findByUserId(userId: string, params?: TaskQueryParams): Promise<TaskEntity[]>;
  create(task: TaskEntity): Promise<TaskEntity>;
  update(id: string, task: Partial<TaskEntity>): Promise<TaskEntity | null>;
  delete(id: string): Promise<boolean>;
  count(userId: string, filters?: { status?: TaskStatus; priority?: TaskPriority }): Promise<number>;
}
