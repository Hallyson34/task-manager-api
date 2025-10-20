import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { LoginService } from './services/login/login.service';
import { RegisterService } from './services/register/register.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: false,
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginService,
    RegisterService,
    JwtAuthGuard,
    RolesGuard,
    JwtStrategy,
  ],
})
export class AuthModule {}
