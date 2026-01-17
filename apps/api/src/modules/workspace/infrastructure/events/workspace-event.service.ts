import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { WorkspaceEventType, WorkspaceEvent } from '@task-manager/types';

@Injectable()
export class WorkspaceEventService {
  private userEventStreams: Map<string, Subject<MessageEvent>> = new Map();

  emitEventToUsers(userIds: string[], type: WorkspaceEventType, payload: any): void {
    const event: WorkspaceEvent = {
      type,
      workspaceId: payload.workspaceId || payload.workspace?.id || '',
      payload,
    };

    const eventMessage: MessageEvent = {
      data: JSON.stringify(event),
    } as MessageEvent;

    userIds.forEach((userId) => {
      const stream = this.getOrCreateStream(userId);
      stream.next(eventMessage);
    });
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
