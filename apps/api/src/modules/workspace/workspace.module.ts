import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceController } from './presentation/controllers/workspace.controller';
import { WorkspaceService } from './application/services/workspace.service';
import { WorkspaceRepository } from './infrastructure/persistence/mongodb/workspace.repository';
import { Workspace, WorkspaceSchema } from './infrastructure/persistence/mongodb/workspace.schema';
import { WorkspaceEventService } from './infrastructure/events/workspace-event.service';
import { WorkspaceMemberGuard } from './presentation/guards/workspace-member.guard';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Workspace.name, schema: WorkspaceSchema }]),
    TaskModule,
  ],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceRepository,
    {
      provide: 'IWorkspaceRepository',
      useClass: WorkspaceRepository,
    },
    WorkspaceEventService,
    WorkspaceMemberGuard,
  ],
  exports: [WorkspaceService, WorkspaceMemberGuard],
})
export class WorkspaceModule {}
