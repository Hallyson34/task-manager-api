import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { FindAllUserService } from './find-all-user-service';
import { UserRepository } from '../../user.repository';
import { UserDto } from '../../dto/user.dto';

describe('FindAllUserService', () => {
  let service: FindAllUserService;
  let repository: UserRepository;

  const mockUsers: UserDto[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      createdAt: new Date('2025-01-01T00:00:00Z'),
      tasks: [],
      roles: [],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'hashedpassword2',
      createdAt: new Date('2025-01-02T00:00:00Z'),
      tasks: [],
      roles: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUserService,
        {
          provide: UserRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FindAllUserService>(FindAllUserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully return all users', async () => {
    const repositorySpy = jest
      .spyOn(repository, 'findAll')
      .mockResolvedValue(mockUsers);

    const result = await service.execute();

    expect(repositorySpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers);
  });

  it('should return an empty array when no users exist', async () => {
    const repositorySpy = jest
      .spyOn(repository, 'findAll')
      .mockResolvedValue([]);

    const result = await service.execute();

    expect(repositorySpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('should log error and throw InternalServerErrorException when repository fails', async () => {
    const error = new Error('Database failure');
    jest.spyOn(repository, 'findAll').mockRejectedValue(error);

    const loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});

    await expect(service.execute()).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Erro ao buscar usuarios:',
      error,
    );
  });

  it('should call repository.findAll exactly once', async () => {
    const repositorySpy = jest
      .spyOn(repository, 'findAll')
      .mockResolvedValue(mockUsers);

    await service.execute();

    expect(repositorySpy).toHaveBeenCalledTimes(1);
  });
});
