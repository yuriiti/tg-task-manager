import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './presentation/controllers/task.controller';
import { TaskService } from './application/services/task.service';
import { TaskQueryService } from './application/services/task-query.service';
import { TaskRepository } from './infrastructure/persistence/mongodb/task.repository';
import { TaskCacheRepository } from './infrastructure/persistence/redis/task-cache.repository';
import { Task, TaskSchema } from './infrastructure/persistence/mongodb/task.schema';
import { ITaskRepository } from './domain/interfaces/task.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [
    TaskService,
    TaskQueryService,
    TaskRepository,
    {
      provide: 'ITaskRepository',
      useClass: TaskRepository,
    },
    TaskCacheRepository,
  ],
  exports: [TaskService],
})
export class TaskModule {}
