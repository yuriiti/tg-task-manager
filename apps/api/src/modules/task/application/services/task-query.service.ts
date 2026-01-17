import { Injectable, Inject } from '@nestjs/common';
import { ITaskRepository } from '../../domain/interfaces/task.repository.interface';
import { TaskQueryParams } from '@task-manager/types';

@Injectable()
export class TaskQueryService {
  constructor(
    @Inject('ITaskRepository') private readonly taskRepository: ITaskRepository,
  ) {}

  async findByQuery(userId: string, params: TaskQueryParams) {
    return this.taskRepository.findByUserId(userId, params);
  }
}
