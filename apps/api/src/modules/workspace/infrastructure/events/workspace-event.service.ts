import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { WorkspaceEventType, WorkspaceEvent } from '@task-manager/types';

@Injectable()
export class WorkspaceEventService {
  private eventStreams: Map<string, Subject<MessageEvent>> = new Map();

  emitEvent(workspaceId: string, type: WorkspaceEventType, payload: any): void {
    const stream = this.getOrCreateStream(workspaceId);
    const event: WorkspaceEvent = {
      type,
      workspaceId,
      payload,
    };

    stream.next({
      data: JSON.stringify(event),
    } as MessageEvent);
  }

  getEventStream(workspaceId: string): Observable<MessageEvent> {
    return this.getOrCreateStream(workspaceId).asObservable();
  }

  private getOrCreateStream(workspaceId: string): Subject<MessageEvent> {
    if (!this.eventStreams.has(workspaceId)) {
      this.eventStreams.set(workspaceId, new Subject<MessageEvent>());
    }
    return this.eventStreams.get(workspaceId)!;
  }

  removeStream(workspaceId: string): void {
    const stream = this.eventStreams.get(workspaceId);
    if (stream) {
      stream.complete();
      this.eventStreams.delete(workspaceId);
    }
  }
}
