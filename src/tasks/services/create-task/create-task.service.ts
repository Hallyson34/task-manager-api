import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { TaskDto } from 'src/tasks/dto/task.dto';
import { TaskRepository } from 'src/tasks/task.repository';

@Injectable()
export class CreateTaskService {
  private readonly logger = new Logger(CreateTaskService.name);

  constructor(private readonly repository: TaskRepository) {}

  async execute(userId: number, data: CreateTaskDto): Promise<TaskDto> {
    try {
      return await this.repository.create(userId, data);
    } catch (error) {
      this.logger.error('Erro ao criar tarefa:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentar criar a tarefa no banco de dados.',
      );
    }
  }
}
