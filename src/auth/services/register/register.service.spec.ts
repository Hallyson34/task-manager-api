import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RegisterService } from './register.service';
import { RegisterDto } from '../../dto/register.dto';
import { AuthDto } from '../../dto/auth.dto';
import { RoleType, User, Roles } from '@prisma/client';

jest.mock('bcrypt');

describe('RegisterService', () => {
  let service: RegisterService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUser: User & { roles: Roles[] } = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'hashed_password',
    createdAt: new Date(),
    roles: [{ id: 1, name: RoleType.BASIC_USER }],
  };

  const mockRegisterDto: RegisterDto = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'plain_password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully register a new user', async () => {
    const prismaFindSpy = jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue(null);
    const bcryptSpy = jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValue('hashed_password' as never);
    const prismaCreateSpy = jest
      .spyOn(prisma.user, 'create')
      .mockResolvedValue(mockUser);
    const jwtSignSpy = jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValue('mocked_token' as never);

    const result: AuthDto = await service.execute(mockRegisterDto);

    expect(prismaFindSpy).toHaveBeenCalledWith({
      where: { email: mockRegisterDto.email },
    });

    expect(bcryptSpy).toHaveBeenCalledWith(mockRegisterDto.password, 10);

    expect(prismaCreateSpy).toHaveBeenCalledWith({
      data: {
        name: mockRegisterDto.name,
        email: mockRegisterDto.email,
        password: 'hashed_password',
        roles: { connect: { name: RoleType.BASIC_USER } },
      },
      include: { roles: true },
    });

    expect(jwtSignSpy).toHaveBeenCalledWith({
      sub: mockUser.id,
      email: mockUser.email,
      roles: [RoleType.BASIC_USER],
    });

    expect(result).toEqual({
      accessToken: 'mocked_token',
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        roles: [RoleType.BASIC_USER],
      },
    });
  });

  it('should throw ConflictException if email already exists', async () => {
    const prismaFindSpy = jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue(mockUser);

    await expect(service.execute(mockRegisterDto)).rejects.toThrow(
      ConflictException,
    );

    expect(prismaFindSpy).toHaveBeenCalledWith({
      where: { email: mockRegisterDto.email },
    });
  });

  it('should hash password correctly before saving', async () => {
    const prismaFindSpy = jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue(null);
    const bcryptSpy = jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValue('hashed_password' as never);
    jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token' as never);

    await service.execute(mockRegisterDto);

    expect(prismaFindSpy).toHaveBeenCalled();
    expect(bcryptSpy).toHaveBeenCalledWith(mockRegisterDto.password, 10);
  });

  it('should include BASIC_USER role by default when creating', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password' as never);
    const prismaCreateSpy = jest
      .spyOn(prisma.user, 'create')
      .mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token' as never);

    await service.execute(mockRegisterDto);

    expect(prismaCreateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          roles: { connect: { name: RoleType.BASIC_USER } },
        }) as Record<string, unknown>,
      }),
    );
  });

  it('should return correct AuthDto structure', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password' as never);
    jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);
    const jwtSignSpy = jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValue('jwt_token' as never);

    const result = await service.execute(mockRegisterDto);

    expect(jwtSignSpy).toHaveBeenCalled();
    expect(result).toEqual({
      accessToken: 'jwt_token',
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        roles: [RoleType.BASIC_USER],
      },
    });
  });
});
