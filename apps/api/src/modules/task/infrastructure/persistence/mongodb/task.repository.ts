import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ITaskRepository } from '../../../domain/interfaces/task.repository.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';
import { Task, TaskDocument } from './task.schema';
import { TaskQueryParams, TaskStatus, TaskPriority } from '@task-manager/types';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async findById(id: string): Promise<TaskEntity | null> {
    const task = await this.taskModel.findById(id).exec();
    return task ? this.toDomain(task) : null;
  }

  async findByUserId(userId: string, params?: TaskQueryParams): Promise<TaskEntity[]> {
    // userId is MongoDB _id (string), convert to ObjectId
    const userObjectId = new Types.ObjectId(userId);
    const query: any = { userId: userObjectId };

    if (params?.status) {
      query.status = params.status;
    }

    if (params?.priority) {
      query.priority = params.priority;
    }

    if (params?.tags && params.tags.length > 0) {
      query.tags = { $in: params.tags };
    }

    if (params?.workspaceId) {
      query.workspaceId = new Types.ObjectId(params.workspaceId);
    }

    const sort: any = {};
    if (params?.sortBy) {
      sort[params.sortBy] = params.sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const skip = params?.page && params?.limit 
      ? (params.page - 1) * params.limit 
      : 0;
    const limit = params?.limit || 10;

    const tasks = await this.taskModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return tasks.map((task) => this.toDomain(task));
  }

  async create(task: TaskEntity): Promise<TaskEntity> {
    // userId is MongoDB _id (string), convert to ObjectId
    const userObjectId = new Types.ObjectId(task.userId);
    const createdTask = new this.taskModel({
      userId: userObjectId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: task.tags,
      workspaceId: task.workspaceId,
    });

    const saved = await createdTask.save();
    return this.toDomain(saved);
  }

  async update(id: string, task: Partial<TaskEntity>): Promise<TaskEntity | null> {
    const updated = await this.taskModel
      .findByIdAndUpdate(id, { ...task, updatedAt: new Date() }, { new: true })
      .exec();

    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async count(userId: string, filters?: { status?: TaskStatus; priority?: TaskPriority }): Promise<number> {
    // userId is MongoDB _id (string), convert to ObjectId
    const userObjectId = new Types.ObjectId(userId);
    const query: any = { userId: userObjectId };
    if (filters?.status) query.status = filters.status;
    if (filters?.priority) query.priority = filters.priority;
    return this.taskModel.countDocuments(query).exec();
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<number> {
    const result = await this.taskModel.deleteMany({ workspaceId }).exec();
    return result.deletedCount || 0;
  }

  private toDomain(task: TaskDocument): TaskEntity {
    return new TaskEntity(
      task._id.toString(),
      task.userId.toString(), // Convert ObjectId to string
      task.title,
      task.description,
      task.status,
      task.priority,
      task.dueDate,
      task.tags,
      task.workspaceId?.toString(),
      task.createdAt,
      task.updatedAt,
    );
  }
}
