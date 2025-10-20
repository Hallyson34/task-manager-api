import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskDto } from 'src/tasks/dto/task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { TaskRepository } from 'src/tasks/task.repository';

@Injectable()
export class UpdateTaskService {
  private readonly logger = new Logger(UpdateTaskService.name);

  constructor(private readonly repository: TaskRepository) {}

  async execute(
    userId: number,
    taskId: number,
    data: UpdateTaskDto,
  ): Promise<TaskDto> {
    try {
      return await this.repository.update(taskId, userId, data);
    } catch (error) {
      this.logger.error('Erro ao atualizar tarefa:', error);

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentar editar a tarefa no banco de dados.',
      );
    }
  }
}
