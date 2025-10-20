import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTaskService } from './update-task.service';
import { TaskRepository } from 'src/tasks/task.repository';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { TaskDto } from 'src/tasks/dto/task.dto';
import { TaskPriority } from '@prisma/client';

describe('UpdateTaskService', () => {
  let service: UpdateTaskService;
  let repository: TaskRepository;

  const mockTask: TaskDto = {
    id: 1,
    name: 'Updated Task',
    priority: TaskPriority.MEDIUM,
    finished: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
  };

  const mockUpdateTaskDto: UpdateTaskDto = {
    name: 'Updated Task',
    priority: TaskPriority.MEDIUM,
    finished: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTaskService,
        {
          provide: TaskRepository,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateTaskService>(UpdateTaskService);
    repository = module.get<TaskRepository>(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully update a task', async () => {
    const repositorySpy = jest
      .spyOn(repository, 'update')
      .mockResolvedValue(mockTask);

    const result = await service.execute(1, 10, mockUpdateTaskDto);

    expect(repositorySpy).toHaveBeenCalledWith(10, 1, mockUpdateTaskDto);
    expect(result).toEqual(mockTask);
  });

  it('should throw NotFoundException when task does not exist', async () => {
    const notFoundError = new NotFoundException('Tarefa não encontrada.');
    jest.spyOn(repository, 'update').mockRejectedValue(notFoundError);

    await expect(service.execute(1, 99, mockUpdateTaskDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should log error and throw InternalServerErrorException on database error', async () => {
    const dbError = new Error('Database error');
    jest.spyOn(repository, 'update').mockRejectedValue(dbError);

    const loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});

    await expect(service.execute(1, 5, mockUpdateTaskDto)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Erro ao atualizar tarefa:',
      dbError,
    );
  });

  it('should call repository.update exactly once', async () => {
    const repositorySpy = jest
      .spyOn(repository, 'update')
      .mockResolvedValue(mockTask);

    await service.execute(1, 2, mockUpdateTaskDto);

    expect(repositorySpy).toHaveBeenCalledTimes(1);
  });
});
