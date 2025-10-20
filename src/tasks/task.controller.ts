import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import AuthenticatedUser from 'src/auth/dto/authenticated-user';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskService } from './services/create-task/create-task.service';
import { DeleteTaskService } from './services/delete-task/delete-task.service';
import { FindTasksByUserService } from './services/find-tasks-by-user/find-tasks-by-user.service';
import { UpdateTaskService } from './services/update-task/update-task.service';
import { TaskDto } from './dto/task.dto';
import { FindAllTasksByUserSwagger } from './swagger/find-all-by-user.swagger';
import { CreateTaskSwagger } from './swagger/create-task.swagger';
import { UpdateTaskSwagger } from './swagger/update-task.swagger';
import { DeleteTaskSwagger } from './swagger/delete-task.swagger';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTaskService: CreateTaskService,
    private readonly findTasksByUserService: FindTasksByUserService,
    private readonly updateTaskService: UpdateTaskService,
    private readonly deleteTaskService: DeleteTaskService,
  ) {}

  @FindAllTasksByUserSwagger()
  @Get()
  async findAllByUser(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<TaskDto[]> {
    return this.findTasksByUserService.execute(user.id);
  }

  @CreateTaskSwagger()
  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateTaskDto,
  ): Promise<TaskDto> {
    return this.createTaskService.execute(user.id, body);
  }

  @UpdateTaskSwagger()
  @Patch(':id')
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskDto> {
    return this.updateTaskService.execute(user.id, id, body);
  }

  @DeleteTaskSwagger()
  @Delete(':id')
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.deleteTaskService.execute(user.id, id);
  }
}
