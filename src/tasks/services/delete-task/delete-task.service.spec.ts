import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteTaskService } from './delete-task.service';
import { TaskRepository } from 'src/tasks/task.repository';

describe('DeleteTaskService', () => {
  let service: DeleteTaskService;
  let repository: TaskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskService,
        {
          provide: TaskRepository,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeleteTaskService>(DeleteTaskService);
    repository = module.get<TaskRepository>(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully delete a task', async () => {
    const repositorySpy = jest.spyOn(repository, 'delete').mockResolvedValue(1); // one record deleted

    await service.execute(1, 10);

    expect(repositorySpy).toHaveBeenCalledWith(10, 1);
  });

  it('should throw NotFoundException when task does not exist', async () => {
    const repositorySpy = jest.spyOn(repository, 'delete').mockResolvedValue(0); // no record deleted

    await expect(service.execute(1, 99)).rejects.toThrow(NotFoundException);

    expect(repositorySpy).toHaveBeenCalledWith(99, 1);
  });

  it('should log error and throw InternalServerErrorException on database error', async () => {
    const dbError = new Error('Database failure');
    jest.spyOn(repository, 'delete').mockRejectedValue(dbError);

    const loggerSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});

    await expect(service.execute(1, 50)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(loggerSpy).toHaveBeenCalledWith('Erro ao remover tarefa:', dbError);
  });

  it('should rethrow NotFoundException directly (without wrapping)', async () => {
    const notFoundError = new NotFoundException('Tarefa não encontrada.');
    jest.spyOn(repository, 'delete').mockRejectedValue(notFoundError);

    await expect(service.execute(1, 2)).rejects.toThrow(NotFoundException);
  });
});
