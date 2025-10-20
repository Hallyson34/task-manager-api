import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuthDto } from '../../dto/auth.dto';
import { RegisterDto } from '../../dto/register.dto';
import { RoleType } from '@prisma/client';
import JwtPayload from 'src/auth/dto/jwt-payload';

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: RegisterDto): Promise<AuthDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing)
      throw new ConflictException(
        'Este e-mail já está em uso. Tente outro ou recupere sua senha.',
      );

    const hashedPassword: string = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roles: {
          connect: { name: RoleType.BASIC_USER },
        },
      },
      include: { roles: true },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.name),
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles.map((role) => role.name),
      },
    };
  }
}
