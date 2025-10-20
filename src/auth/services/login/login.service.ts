import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuthDto } from '../../dto/auth.dto';
import { LoginDto } from '../../dto/login.dto';
import JwtPayload from 'src/auth/dto/jwt-payload';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: LoginDto): Promise<AuthDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: { roles: true },
    });

    if (!user)
      throw new UnauthorizedException(
        'Credenciais inválidas. Verifique seu e-mail e senha.',
      );

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException(
        'Credenciais inválidas. Verifique seu e-mail e senha.',
      );

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
