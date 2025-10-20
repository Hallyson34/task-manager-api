import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { FindTasksByUserService } from './find-tasks-by-user.service';
import { TaskRepository } from 'src/tasks/task.repository';
import { TaskDto } from 'src/tasks/dto/task.dto';
import { TaskPriority } from '@prisma/client';

describe('FindTasksByUserService', () => {
  let service: FindTasksByUserService;
  let repository: TaskRepository;

  const mockTasks: TaskDto[] = [
    {
      id: 1,
      name: 'Task One',
      priority: TaskPriority.HIGH,
      finished: false,
      createdAt: new Date('2025-01-01T00:00:00Z'),
    },
    {
      id: 2,
      name: 'Task Two',
      priority: TaskPriority.MEDIUM,
      finished: true,
      createdAt: new Date('2025-01-02T00:00:00Z'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindTasksByUserService,
        {
          provide: TaskRepository,
          useValue: {
            findByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FindTasksByUserService>(FindTasksByUserService);
    repository = module.get<TaskRepository>(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully return tasks for the user', async () => {
    const repositorySpy = jest
      .spyOn(repository, 'findByUserId')
      .mockResolvedValue(mockTasks);

    const result = await service.execute(1);

    expect(repositorySpy).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockTasks);
  });

  it('should return an empty array if user has no tasks', async () => {
    const repositorySpy = jest
      .spyOn(repository, 'findByUserId')
      .mockResolvedValue([]);

    const result = await service.execute(99);

    expect(repositorySpy).toHaveBeenCalledWith(99);
    expect(result).toEqual([]);
  });

  it('should log error and throw InternalServerErrorException when repository fails', async () => {
    const error = new Error('Database error');
    jest.spyOn(repository, 'findByUserId').mockRejectedValue(error);

    const loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});

    await expect(service.execute(1)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Erro ao buscar tarefas:',
      error,
    );
  });

  it('should call repository.findByUserId exactly once', async () => {
    const repositorySpy = jest
      .spyOn(repository, 'findByUserId')
      .mockResolvedValue(mockTasks);

    await service.execute(1);

    expect(repositorySpy).toHaveBeenCalledTimes(1);
  });
});
