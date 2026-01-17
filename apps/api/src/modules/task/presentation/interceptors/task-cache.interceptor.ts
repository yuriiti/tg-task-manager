import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TaskCacheRepository } from '../../infrastructure/persistence/redis/task-cache.repository';

@Injectable()
export class TaskCacheInterceptor implements NestInterceptor {
  constructor(private readonly cacheRepository: TaskCacheRepository) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, params } = request;

    // Only cache GET requests
    if (method === 'GET') {
      if (params.id) {
        // Try to get from cache
        const cached = await this.cacheRepository.getTask(params.id);
        if (cached) {
          return of(cached);
        }
      }
    }

    return next.handle().pipe(
      tap(async (data) => {
        // Cache the response
        if (method === 'GET' && params.id && data) {
          await this.cacheRepository.setTask(data);
        }
      }),
    );
  }
}
