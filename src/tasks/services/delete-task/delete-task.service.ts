import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from 'src/tasks/task.repository';

@Injectable()
export class DeleteTaskService {
  private readonly logger = new Logger(DeleteTaskService.name);

  constructor(private readonly repository: TaskRepository) {}

  async execute(userId: number, taskId: number): Promise<void> {
    try {
      const deletedCount: number = await this.repository.delete(taskId, userId);

      if (deletedCount === 0) {
        throw new NotFoundException('Tarefa não encontrada.');
      }
    } catch (error) {
      this.logger.error('Erro ao remover tarefa:', error);

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentar remover a tarefa no banco de dados.',
      );
    }
  }
}
