import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { TaskEventType, TaskEvent } from '@task-manager/types';

@Injectable()
export class TaskEventService {
  private userEventStreams: Map<string, Subject<MessageEvent>> = new Map();

  emitEvent(userId: string, type: TaskEventType, payload: any): void {
    const stream = this.getOrCreateStream(userId);
    const event: TaskEvent = {
      type,
      userId,
      payload,
    };

    stream.next({
      data: JSON.stringify(event),
    } as MessageEvent);
  }

  getEventStream(userId: string): Observable<MessageEvent> {
    return this.getOrCreateStream(userId).asObservable();
  }

  private getOrCreateStream(userId: string): Subject<MessageEvent> {
    if (!this.userEventStreams.has(userId)) {
      this.userEventStreams.set(userId, new Subject<MessageEvent>());
    }
    return this.userEventStreams.get(userId)!;
  }

  removeStream(userId: string): void {
    const stream = this.userEventStreams.get(userId);
    if (stream) {
      stream.complete();
      this.userEventStreams.delete(userId);
    }
  }
}
