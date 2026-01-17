import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UnauthorizedException,
  Sse,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TaskService } from '../../application/services/task.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '../../application/dto';
import { TaskEntity } from '../../domain/entities/task.entity';
import { AuthenticatedRequest } from '../../../../common/types/request.types';
import { TaskEventService } from '../../infrastructure/events/task-event.service';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskEventService: TaskEventService,
  ) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const userId = req.user.id; // MongoDB _id

    const task = await this.taskService.create(userId, createTaskDto, createTaskDto.workspaceId);
    return this.toResponseDto(task);
  }

  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('workspaceId') workspaceId?: string,
  ): Promise<TaskResponseDto[]> {
    const userId = req.user.id; // MongoDB _id

    const tasks = await this.taskService.findAll(userId, { workspaceId });
    return tasks.map((task) => this.toResponseDto(task));
  }

  @Get('sse')
  @Sse()
  taskSse(@Request() req: AuthenticatedRequest): Observable<MessageEvent> {
    const userId = req.user.id;
    return this.taskEventService.getEventStream(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const userId = req.user.id; // MongoDB _id

    const task = await this.taskService.findOne(id, userId);
    return this.toResponseDto(task);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const userId = req.user.id; // MongoDB _id

    const task = await this.taskService.update(id, userId, updateTaskDto);
    return this.toResponseDto(task);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest): Promise<void> {
    const userId = req.user.id; // MongoDB _id

    await this.taskService.remove(id, userId);
  }

  private toResponseDto(task: TaskEntity): TaskResponseDto {
    return {
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: task.tags,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
