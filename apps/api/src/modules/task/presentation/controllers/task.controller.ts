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
} from '@nestjs/common';
import { TaskService } from '../../application/services/task.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '../../application/dto';
import { TaskEntity } from '../../domain/entities/task.entity';
import { AuthenticatedRequest } from '../../../../common/types/request.types';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const userId = req.user.id; // MongoDB _id

    const task = await this.taskService.create(userId, createTaskDto);
    return this.toResponseDto(task);
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest): Promise<TaskResponseDto[]> {
    const userId = req.user.id; // MongoDB _id

    const tasks = await this.taskService.findAll(userId);
    return tasks.map((task) => this.toResponseDto(task));
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
