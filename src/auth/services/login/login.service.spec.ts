import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { LoginService } from './login.service';
import { LoginDto } from '../../dto/login.dto';
import { AuthDto } from '../../dto/auth.dto';
import { User, Roles } from '@prisma/client';

jest.mock('bcrypt');

describe('LoginService', () => {
  let service: LoginService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUser: User & { roles: Roles[] } = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    createdAt: new Date(),
    roles: [{ id: 1, name: 'ADMIN' }],
  };

  const mockLoginDto: LoginDto = {
    email: 'john@example.com',
    password: 'plain_password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
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

    service = module.get<LoginService>(LoginService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully login when credentials are valid', async () => {
    const prismaSpy = jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    const signSpy = jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValue('mocked_jwt_token' as never);

    const result: AuthDto = await service.execute(mockLoginDto);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { email: mockLoginDto.email },
      include: { roles: true },
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockLoginDto.password,
      mockUser.password,
    );

    expect(signSpy).toHaveBeenCalledWith({
      sub: mockUser.id,
      email: mockUser.email,
      roles: ['ADMIN'],
    });

    expect(result).toEqual({
      accessToken: 'mocked_jwt_token',
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        roles: ['ADMIN'],
      },
    });
  });

  it('should throw UnauthorizedException if user does not exist', async () => {
    const prismaSpy = jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue(null);

    await expect(service.execute(mockLoginDto)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { email: mockLoginDto.email },
      include: { roles: true },
    });
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(service.execute(mockLoginDto)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockLoginDto.password,
      mockUser.password,
    );
  });

  it('should include user roles in JWT payload and return correct structure', async () => {
    const mockUserWithRoles: User & { roles: Roles[] } = {
      ...mockUser,
      roles: [
        { id: 1, name: 'ADMIN' },
        { id: 2, name: 'BASIC_USER' },
      ],
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUserWithRoles);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    const signSpy = jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValue('token_with_roles' as never);

    const result = await service.execute(mockLoginDto);

    expect(signSpy).toHaveBeenCalledWith({
      sub: mockUserWithRoles.id,
      email: mockUserWithRoles.email,
      roles: ['ADMIN', 'BASIC_USER'],
    });

    expect(result.user.roles).toEqual(['ADMIN', 'BASIC_USER']);
    expect(result.accessToken).toBe('token_with_roles');
  });
});
