import { Module } from '@nestjs/common';
import { CreateTaskService } from './services/create-task/create-task.service';
import { UpdateTaskService } from './services/update-task/update-task.service';
import { DeleteTaskService } from './services/delete-task/delete-task.service';
import { FindTasksByUserService } from './services/find-tasks-by-user/find-tasks-by-user.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { TaskRepository } from './task.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TaskController],
  providers: [
    TaskRepository,
    CreateTaskService,
    UpdateTaskService,
    DeleteTaskService,
    FindTasksByUserService,
  ],
})
export class TaskModule {}
