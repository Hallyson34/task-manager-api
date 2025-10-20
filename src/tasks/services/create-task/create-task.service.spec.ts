import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTaskService } from './create-task.service';
import { TaskRepository } from 'src/tasks/task.repository';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { TaskDto } from 'src/tasks/dto/task.dto';

describe('CreateTaskService', () => {
  let service: CreateTaskService;
  let repository: TaskRepository;

  const mockTask: TaskDto = {
    id: 1,
    name: 'New Task',
    priority: 'HIGH',
    finished: false,
    createdAt: new Date(),
  };

  const mockCreateTaskDto: CreateTaskDto = {
    name: 'New Task',
    priority: 'HIGH',
    finished: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskService,
        {
          provide: TaskRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateTaskService>(CreateTaskService);
    repository = module.get<TaskRepository>(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully create a new task', async () => {
    const repositorySpy = jest
      .spyOn(repository, 'create')
      .mockResolvedValue(mockTask);

    const result = await service.execute(1, mockCreateTaskDto);

    expect(repositorySpy).toHaveBeenCalledWith(1, mockCreateTaskDto);
    expect(result).toEqual(mockTask);
  });

  it('should log error and throw InternalServerErrorException when repository.create fails', async () => {
    const error = new Error('Database failure');
    jest.spyOn(repository, 'create').mockRejectedValue(error);

    const loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});

    await expect(service.execute(1, mockCreateTaskDto)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(loggerErrorSpy).toHaveBeenCalledWith('Erro ao criar tarefa:', error);
  });

  it('should call repository.create exactly once', async () => {
    const repositorySpy = jest
      .spyOn(repository, 'create')
      .mockResolvedValue(mockTask);

    await service.execute(1, mockCreateTaskDto);

    expect(repositorySpy).toHaveBeenCalledTimes(1);
  });
});
