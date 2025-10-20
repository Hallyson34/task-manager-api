import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TaskDto } from 'src/tasks/dto/task.dto';
import { TaskRepository } from 'src/tasks/task.repository';

@Injectable()
export class FindTasksByUserService {
  private readonly logger = new Logger(FindTasksByUserService.name);

  constructor(private readonly repository: TaskRepository) {}

  async execute(userId: number): Promise<TaskDto[]> {
    try {
      const tasks = await this.repository.findByUserId(userId);

      const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };

      return tasks.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      );
    } catch (error) {
      this.logger.error('Erro ao buscar tarefas:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentar buscar as tarefas no banco de dados.',
      );
    }
  }
}
