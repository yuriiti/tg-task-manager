import { Injectable } from '@nestjs/common';
import { redisConfig } from 'src/config/redis.config';
import { createClient } from 'redis';
import { Task } from '@task-manager/types';

@Injectable()
export class TaskCacheRepository {
  private client;

  constructor() {
    const config = redisConfig();
    this.client = createClient({
      url: `redis://${config.host}:${config.port}`,
      password: config.password,
    });
    this.client.connect().catch(console.error);
  }

  async getTask(id: string): Promise<Task | null> {
    const key = `task:${id}`;
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async setTask(task: Task, ttl: number = 3600): Promise<void> {
    const key = `task:${task.id}`;
    await this.client.setEx(key, ttl, JSON.stringify(task));
  }

  async deleteTask(id: string): Promise<void> {
    const key = `task:${id}`;
    await this.client.del(key);
  }

  async getUserTasks(userId: string): Promise<Task[] | null> {
    const key = `tasks:user:${userId}`;
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async setUserTasks(userId: string, tasks: Task[], ttl: number = 1800): Promise<void> {
    const key = `tasks:user:${userId}`;
    await this.client.setEx(key, ttl, JSON.stringify(tasks));
  }

  async invalidateUserTasks(userId: string): Promise<void> {
    const key = `tasks:user:${userId}`;
    await this.client.del(key);
  }
}
